"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

const SKIN_TYPES = [
  { value: "dry", label: "Seca" },
  { value: "oily", label: "Grasa" },
  { value: "combination", label: "Mixta" },
  { value: "normal", label: "Normal" },
  { value: "sensitive", label: "Sensible" },
];

const CONCERNS = [
  { value: "acne", label: "Acné" },
  { value: "darkSpots", label: "Manchas" },
  { value: "dehydration", label: "Deshidratación" },
  { value: "aging", label: "Envejecimiento" },
  { value: "texture", label: "Textura" },
  { value: "dullness", label: "Opacidad" },
  { value: "pores", label: "Poros" },
  { value: "oiliness", label: "Exceso de grasa" },
  { value: "sensitive", label: "Sensibilidad" },
  { value: "redness", label: "Rojeces" },
];

const skinTypeLabels: Record<string, string> = {
  dry: "Seca",
  oily: "Grasa",
  combination: "Mixta",
  normal: "Normal",
  sensitive: "Sensible",
};

const concernLabels: Record<string, string> = {
  acne: "Acné",
  darkSpots: "Manchas",
  dehydration: "Deshidratación",
  aging: "Envejecimiento",
  texture: "Textura",
  dullness: "Opacidad",
  pores: "Poros",
  oiliness: "Exceso de grasa",
  sensitive: "Sensibilidad",
  redness: "Rojeces",
};

export default function ProfilePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialData, setInitialData] = useState({
    name: "",
    email: "",
    phone: "",
    skinType: "",
    concerns: [] as string[],
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skinType: "",
    concerns: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data on mount
  React.useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        if (data.customer) {
          setInitialData({
            name: data.customer.name || "",
            email: data.customer.email || "",
            phone: data.customer.phone || "",
            skinType: data.customer.skinType || "",
            concerns: data.customer.concerns || [],
          });
          setFormData({
            name: data.customer.name || "",
            email: data.customer.email || "",
            phone: data.customer.phone || "",
            skinType: data.customer.skinType || "",
            concerns: data.customer.concerns || [],
          });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nombre es requerido";
    if (!formData.email.trim()) newErrors.email = "Email es requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email inválido";
    if (formData.phone && !/^[\d\s\-+()]{10,}$/.test(formData.phone)) newErrors.phone = "Teléfono inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar perfil");
      router.push("/account");
      router.refresh();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Error al actualizar perfil" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        concerns: checked
          ? [...prev.concerns, value]
          : prev.concerns.filter(c => c !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="px-6 py-16 sm:px-10 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wine" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
                Editar perfil
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-plum-ink/10 bg-ivory p-6">
              <h2 className="font-display text-lg text-plum-ink mb-6">Información personal</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-plum-ink mb-1">
                    Nombre completo <span className="text-wine">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-3 text-sm ${
                      errors.name ? "border-red-400" : "border-plum-ink/15"
                    } focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-plum-ink mb-1">
                    Email <span className="text-wine">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-3 text-sm ${
                      errors.email ? "border-red-400" : "border-plum-ink/15"
                    } focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-plum-ink mb-1">
                    Teléfono (opcional)
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
              </div>
            </div>

            <div className="rounded-2xl border border-plum-ink/10 bg-ivory p-6">
              <h2 className="font-display text-lg text-plum-ink mb-6">Perfil de piel</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-plum-ink mb-2">
                    Tipo de piel
                  </label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {SKIN_TYPES.map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm cursor-pointer transition-colors ${
                          formData.skinType === type.value
                            ? "border-wine bg-wine/5 text-wine"
                            : "border-plum-ink/15 text-plum-ink hover:border-wine/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="skinType"
                          value={type.value}
                          checked={formData.skinType === type.value}
                          onChange={handleChange}
                          className="h-4 w-4 text-wine focus:ring-wine/20"
                        />
                        <span>{type.label}</span>
                      </label>
                    ))}
                    <label
                      className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm cursor-pointer transition-colors border-plum-ink/15 text-plum-ink hover:border-wine/40"
                    >
                      <input
                        type="radio"
                        name="skinType"
                        value=""
                        checked={!formData.skinType}
                        onChange={handleChange}
                        className="h-4 w-4 text-wine focus:ring-wine/20"
                      />
                      <span>No especificar</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-plum-ink mb-2">
                    Preocupaciones principales
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {CONCERNS.map((concern) => (
                      <label
                        key={concern.value}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                          formData.concerns.includes(concern.value)
                            ? "border-wine bg-wine/5 text-wine"
                            : "border-plum-ink/15 text-plum-ink hover:border-wine/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name={concern.value}
                          value={concern.value}
                          checked={formData.concerns.includes(concern.value)}
                          onChange={handleChange}
                          className="h-4 w-4 text-wine focus:ring-wine/20 rounded"
                        />
                        <span>{concern.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-plum-ink/50">
                    Selecciona todas las que apliquen. Esto ayuda a personalizar tus recomendaciones.
                  </p>
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