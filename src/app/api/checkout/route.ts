import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { orders, orderItems, products } from "@/lib/db/schema";
import { StripePaymentProvider } from "@/server/providers/stripe-payment-provider";

type CheckoutBody = {
  items: { productId: string; name: string; price: number; quantity: number; cocktailId?: string }[];
  guestEmail?: string;
  guestPhone?: string;
  customerId?: string;
};

export async function POST(request: Request) {
  try {
    const body: CheckoutBody = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
    }

    if (!body.customerId && !body.guestEmail) {
      return NextResponse.json(
        { error: "Se necesita un email (invitado) o una cuenta." },
        { status: 400 },
      );
    }

    // 1. Server-side price validation and stock check
    const productIds = body.items.map(i => i.productId);
    const dbProducts = await db.query.products.findMany({
      where: (p, { inArray }) => inArray(p.id, productIds),
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({ error: "Uno o más productos no fueron encontrados." }, { status: 400 });
    }

    let validatedSubtotal = 0;
    for (const item of body.items) {
      const dbProd = dbProducts.find(p => p.id === item.productId);
      if (!dbProd) continue;
      if (!dbProd.active) {
        return NextResponse.json({ error: `El producto ${dbProd.name} ya no está disponible.` }, { status: 400 });
      }
      if (dbProd.stock < item.quantity) {
        return NextResponse.json({ error: `Stock insuficiente para ${dbProd.name}. Disponible: ${dbProd.stock}` }, { status: 400 });
      }
      validatedSubtotal += Number(dbProd.price) * item.quantity;
    }

    // 2. Shipping logic
    // Envío gratis en compras mayores o iguales a $1200 MXN, de lo contrario $150 MXN.
    const shipping = validatedSubtotal >= 1200 ? 0 : 150;
    const total = validatedSubtotal + shipping;

    // 3. Create Order
    const [order] = await db
      .insert(orders)
      .values({
        customerId: body.customerId,
        guestEmail: body.guestEmail,
        guestPhone: body.guestPhone,
        subtotal: validatedSubtotal.toFixed(2),
        total: total.toFixed(2),
        status: "pending",
      })
      .returning();

    await db.insert(orderItems).values(
      body.items.map((item) => ({
        orderId: order!.id,
        productId: item.productId,
        cocktailId: item.cocktailId,
        quantity: item.quantity,
        unitPrice: Number(dbProducts.find(p => p.id === item.productId)?.price || 0).toFixed(2),
      })),
    );

    // 4. Payment Integration
    const paymentProvider = new StripePaymentProvider();
    const intent = await paymentProvider.createPaymentIntent({
      orderId: order!.id,
      amount: Math.round(total * 100), // Stripe usa centavos
      currency: "mxn",
      customerEmail: body.guestEmail,
    });

    await db
      .update(orders)
      .set({ paymentProviderRef: intent.providerRef })
      .where(eq(orders.id, order!.id));

    return NextResponse.json({
      orderId: order!.id,
      clientSecret: intent.clientSecret,
      subtotal: validatedSubtotal,
      shipping: shipping,
      total: total,
    });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
