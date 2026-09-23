"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

const STATES = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche",
  "Chiapas", "Chihuahua", "Coahuila", "Colima", "Ciudad de México",
  "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "México",
  "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla",
  "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora",
  "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

interface EditAddressFormProps {
  initialData: {
    id: string;
    name: string;
    recipientName: string;
    phone: string;
    street: string;
    exteriorNumber: string;
    interiorNumber: string | null;
    neighborhood: string | null;
    city: string;
    state: string;
    postalCode: string;
    isDefault: boolean;
  };
}

export default function EditAddressForm({ initialData }: EditAddressFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: initialData.name,
    recipientName: initialData.recipientName,
    phone: initialData.phone,
    street: initialData.street,
    exteriorNumber: initialData.exteriorNumber,
    interiorNumber: initialData.interiorNumber || "",
    neighborhood: initialData.neighborhood || "",
    city: initialData.city,
    state: initialData.state,
    postalCode: initialData.postalCode,
    isDefault: initialData.isDefault,
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nombre de la dirección es requerido";
    if (!formData.recipientName.trim()) newErrors.recipientName = "Nombre del destinatario es requerido";
    if (!formData.phone.trim()) newErrors.phone = "Teléfono es requerido";
    if (!formData.street.trim()) newErrors.street = "Calle es requerido";
    if (!formData.exteriorNumber.trim()) newErrors.exteriorNumber = "Número exterior es requerido";
    if (!formData.city.trim()) newErrors.city = "Ciudad es requerido";
    if (!formData.state) newErrors.state = "Estado es requerido";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Código postal es requerido";
    if (formData.postalCode.trim() && !/^\d{5}$/.test(formData.postalCode)) newErrors.postalCode = "Código postal debe ser 5 dígitos";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/addresses/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar dirección");
      router.push("/account/addresses");
      router.refresh();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Error al actualizar dirección" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-dot" aria-hidden="true" />
                Mi Cuenta
              </p>
              <h1 className="mt-1 font-display text-3xl text-plum-ink font-normal">
                Editar dirección
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-plum-ink/10 bg-ivory p-6">
              <h2 className="font-display text-lg text-plum-ink mb-6">Información de la dirección</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-plum-ink mb-1">
                    Nombre de la dirección <span className="text-wine">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Casa, Oficina, De mis padres"
                    className={`w-full rounded-lg border px-4 py-3 text-sm ${
                      errors.name ? "border-red-400" : "border-plum-ink/15"
                    } focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="recipientName" className="block text-sm font-medium text-plum-ink mb-1">
                    Nombre del destinatario <span className="text-wine">*</span>
                  </label>
                  <input
                    type="text"
                    id="recipientName"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder="Nombre completo de quien recibe"
                    className={`w-full rounded-lg border px-4 py-3 text-sm ${
                      errors.recipientName ? "border-red-400" : "border-plum-ink/15"
                    } focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine`}
                  />
                  {errors.recipientName && <p className="mt-1 text-sm text-red-600">{errors.recipientName}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-plum-ink mb-1">
                    Teléfono <span className="text-wine">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="55 1234 5678"
                    className={`w-full rounded-lg border px-4 py-3 text-sm ${
                      errors.phone ? "border-red-400" : "border-plum-ink/15"
                    } focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-plum-ink mb-1">
                    Calle <span className="text-wine">*</span>
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Av. Insurgentes Sur"
                    className={`w-full rounded-lg border px-4 py-3 text-sm ${
                      errors.street ? "border-red-400" : "border-plum-ink/15"
                    } focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine`}
                  />
                  {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street}</p>}
                </div>

                <div>
                  <label htmlFor="exteriorNumber" className="block text-sm font-medium text-plum-ink mb-1">
                    Número exterior <span className="text-wine">*</span>
                  </label>
                  <input
                    type="text"
                    id="exteriorNumber"
                    name="exteriorNumber"
                    value={formData.exteriorNumber}
                    onChange={handleChange}
                    placeholder="123"
                    className={`w-full rounded-lg border px-4 py-3 text-sm ${
                      errors.exteriorNumber ? "border-red-400" : "border-plum-ink/15"
                    } focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine`}
                  />
                  {errors.exteriorNumber && <p className="mt-1 text-sm text-red-600">{errors.exteriorNumber}</p>}
                </div>

                <div>
                  <label htmlFor="interiorNumber" className="block text-sm font-medium text-plum-ink mb-1">
                    Número interior (opcional)
                  </label>
                  <input
                    type="text"
                    id="interiorNumber"
                    name="interiorNumber"
                    value={formData.interiorNumber}
                    onChange={handleChange}
                    placeholder="Dept. 4B"
                    className={`w-full rounded-lg border px-4 py-3 text-sm border-plum-ink/15 focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-plum-ink mb-1">
                    Colonia / Fraccionamiento (opcional)
                  </label>
                  <input
                    type="text"
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    placeholder="Roma Norte"
                    className={`w-full rounded-lg border px-4 py-3 text-sm border-plum-ink/15 focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine`}
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-plum-ink mb-1">
                    Ciudad / Delegación <span className="text-wine">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ciudad de México"
                    className={`w-full rounded-lg border px-4 py-3 text-sm ${
                      errors.city ? "border-red-400" : "border-plum-ink/15"
                    } focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine`}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-plum-ink mb-1">
                    Estado <span className="text-wine">*</span>
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-3 text-sm ${
                      errors.state ? "border-red-400" : "border-plum-ink/15"
                    } focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine`}
                  >
                    <option value="">Seleccionar estado</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-plum-ink mb-1">
                    Código postal <span className="text-wine">*</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="06700"
                    maxLength={5}
                    className={`w-full rounded-lg border px-4 py-3 text-sm ${
                      errors.postalCode ? "border-red-400" : "border-plum-ink/15"
                    } focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine`}
                  />
                  {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-plum-ink/30 text-wine focus:ring-wine/20"
                    />
                    <span className="text-sm text-plum-ink">Establecer como dirección predeterminada</span>
                  </label>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
                {errors.submit}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn btn-primary btn-lg disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 btn btn-outline btn-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}