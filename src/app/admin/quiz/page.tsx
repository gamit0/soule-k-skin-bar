import { db } from "@/lib/db/client";
import { createQuestion } from "./actions";

export default async function AdminQuizPage() {
  const questions = await db.query.quizQuestions.findMany({
    orderBy: (q, { asc }) => [asc(q.order)],
    with: { options: { with: { weights: true } } },
  });
  const shots = await db.query.shots.findMany();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
        Skin Quiz
      </h1>
      <p className="mt-2 text-sm text-plum-ink/50">
        {shots.length === 0 &&
          "Crea primero tus shots para poder asignarles pesos desde las opciones."}
      </p>

      <form
  action={async (formData) => {
    'use server';
    await createQuestion(formData);
  }}
  className="mt-6 grid max-w-xl gap-3"
>
  <input name="text" placeholder="Texto de la pregunta" required className="rounded border border-plum-ink/15 px-3 py-2" />
  <select name="type" className="rounded border border-plum-ink/15 px-3 py-2">
    <option value="single">Selección única</option>
  </select>
  <button type="submit">Guardar</button>
</form>

      <ul className="mt-10 space-y-6">
        {questions.map((q) => (
          <li key={q.id} className="rounded-lg border border-plum-ink/10 p-4">
            <p className="text-plum-ink">{q.text}</p>
            <ul className="mt-2 space-y-1 text-sm text-plum-ink/60">
              {q.options.map((o) => (
                <li key={o.id}>
                  • {o.label} — pesos: {o.weights.length}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-plum-ink/40">
              Para agregar opciones y pesos por shot usa Drizzle Studio
              (`npm run db:studio`) hasta construir el editor visual — ver
              DOC-PENDIENTES.md.
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
