"use client";

import { useRouter } from "next/navigation";

export function BackToQuizButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/quiz")}
      className="group inline-flex items-center gap-2 text-sm font-medium text-plum-ink/60 transition-all duration-300 hover:text-wine"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-plum-ink/20 transition-all duration-300 group-hover:border-wine group-hover:bg-wine/5">
        <span className="transition-transform group-hover:-translate-x-0.5">←</span>
      </div>
      <span className="relative">
        Volver al Quiz
        <span className="absolute -bottom-1 left-0 h-px w-0 bg-wine transition-all duration-300 group-hover:w-full" />
      </span>
    </button>
  );
}
