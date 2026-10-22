import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, BookOpenCheck, Brain, CalendarClock } from "lucide-react";
import { InstitutionShell } from "@/components/InstitutionShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { CURRICULUM_LESSONS } from "@shared/institution";
import {
  isReviewDue, loadReviews, saveReviews, scheduleReview,
  type ReviewBook, type ReviewRating,
} from "@/lib/spaced-repetition";
import "./Review.css";

const ratings: { value: ReviewRating; label: string; help: string }[] = [
  { value: "again", label: "No recuerdo", help: "Reintentar en 10 min" },
  { value: "hard", label: "Difícil", help: "Repasar mañana" },
  { value: "good", label: "Bien", help: "Ampliar intervalo" },
  { value: "easy", label: "Fácil", help: "Ampliar más" },
];

/** Recall practice uses the learner's actual completed lessons, not demo cards. */
export default function Review() {
  const { user, isAuthenticated, loading } = useAuth();
  const profile = trpc.profile.get.useQuery(undefined, { enabled: isAuthenticated });
  const [reviews, setReviews] = useState<ReviewBook>({});
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [count, setCount] = useState(0);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setRevealed(false);
    setCount(0);
    setNotice("");
    setLoadedUserId(null);
    if (!user?.id) { setReviews({}); return; }
    setReviews(loadReviews(user.id, window.localStorage));
    setLoadedUserId(user.id);
  }, [user?.id]);

  const finished = useMemo(() => {
    const ids = new Set(profile.data?.completedLessonIds ?? []);
    return CURRICULUM_LESSONS.filter(lesson => ids.has(lesson.id));
  }, [profile.data?.completedLessonIds]);

  const queue = finished.filter(lesson => isReviewDue(reviews[lesson.id]));
  const lesson = queue[0];

  function rate(rating: ReviewRating) {
    if (!user?.id || loadedUserId !== user.id || !lesson) return;
    const updated = {
      ...reviews,
      [lesson.id]: scheduleReview(reviews[lesson.id], rating),
    };
    try {
      saveReviews(user.id, updated, window.localStorage);
      setReviews(updated);
      setCount(current => current + 1);
      setRevealed(false);
      setNotice("");
    } catch {
      setNotice("Tu navegador no permite guardar repasos. Libera espacio o activa el almacenamiento para conservarlos.");
    }
  }

  if (loading || (isAuthenticated && (profile.isLoading || loadedUserId !== user?.id))) {
    return <InstitutionShell compact><div className="loading-page">Preparando tus repasos…</div></InstitutionShell>;
  }

  if (!isAuthenticated) {
    return <InstitutionShell compact><section className="review-wrap">
      <p className="eyebrow">Memoria activa</p><h1>Repasa lo que <em>ya aprendiste.</em></h1>
      <p>Para crear tu cola de repaso, primero entra como estudiante y completa una actividad.</p>
      <Link href="/diagnostico"><Button className="primary-cta">Empezar mi ruta</Button></Link>
    </section></InstitutionShell>;
  }

  if (profile.isError) return <InstitutionShell compact><section className="review-wrap">
    <h1>No hemos podido cargar tus lecciones.</h1><p>Comprueba tu conexión y vuelve a intentarlo.</p>
    <Button variant="outline" onClick={() => profile.refetch()}>Reintentar</Button>
  </section></InstitutionShell>;

  return <InstitutionShell compact><section className="review-wrap">
    <Link href="/mi-espacio" className="review-back"><ArrowLeft size={16} /> Mi espacio</Link>
    <p className="eyebrow">LinguaForge · Memoria activa</p>
    <h1>Recordar también es <em>aprender.</em></h1>
    <p className="review-lead">Recupera de memoria el objetivo de tus lecciones completadas. Revela la referencia y califica cuánto recordaste: la próxima fecha se adapta a tu respuesta.</p>

    <div className="review-metrics" aria-label="Progreso de repaso">
      <span><BookOpenCheck size={18} /> {finished.length} lecciones disponibles</span>
      <span><CalendarClock size={18} /> {queue.length} pendientes ahora</span>
      <span><Brain size={18} /> {count} repasadas en esta sesión</span>
    </div>

    {finished.length === 0 ? <article className="review-panel">
      <h2>Tu primera tarjeta empieza con una lección.</h2>
      <p>Termina una actividad y aparecerá aquí para practicar el recuerdo. No agregamos progreso ficticio.</p>
      <Link href="/programas"><Button className="primary-cta">Explorar programas</Button></Link>
    </article> : lesson ? <article className="review-panel" aria-live="polite" key={lesson.id}>
      <p className="eyebrow">{lesson.level} · {lesson.title}</p>
      <h2>{lesson.prompt}</h2>
      <p>Intenta responder sin consultar el resultado esperado.</p>
      {!revealed ? <Button className="primary-cta" onClick={() => setRevealed(true)}>Mostrar referencia</Button> :
      <div className="review-answer">
        <h3>Referencia de la actividad</h3>
        <p>{lesson.expected}</p>
        <p>¿Cómo fue tu recuerdo?</p>
        <div className="review-ratings">
          {ratings.map(option => <button key={option.value} type="button" onClick={() => rate(option.value)}>
            <strong>{option.label}</strong><small>{option.help}</small>
          </button>)}
        </div>
      </div>}
    </article> : <article className="review-panel review-done" aria-live="polite">
      <BookOpenCheck size={32} />
      <h2>Al día por ahora.</h2>
      <p>No quedan lecciones pendientes. Los próximos repasos aparecerán según sus fechas, sin marcar actividad que no realizaste.</p>
      <Link href="/programas"><Button variant="outline">Continuar estudiando</Button></Link>
    </article>}

    {notice && <p role="alert" className="review-error">{notice}</p>}
    <p className="review-disclaimer">Esta repetición espaciada es una ayuda orientativa, no una evaluación certificada. Sus fechas se guardan solo en este navegador para este estudiante. El progreso del servidor no cambia al repasar; no hay sincronización entre dispositivos.</p>
  </section></InstitutionShell>;
}
