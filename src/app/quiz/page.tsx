import { getActiveQuizQuestions } from "@/server/repositories/quiz-repository";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { Header } from "@/components/marketing/header";
export const dynamic = 'force-dynamic';
export const metadata = { title: "Skin Quiz — Soule K Skin Bar" };

export default async function QuizPage() {
  const questions = await getActiveQuizQuestions();

  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
        <QuizRunner questions={questions} />
      </main>
    </>
  );
}
