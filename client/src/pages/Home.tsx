import { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleUserRound,
  Flame,
  Globe2,
  Headphones,
  Languages,
  LayoutDashboard,
  LockKeyhole,
  Moon,
  PencilLine,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Sun,
  Target,
  Trophy,
  Volume2,
  WandSparkles,
  Zap,
} from "lucide-react";

const LANGUAGES = [
  { code: "es", name: "Español", native: "Español", flag: "ES", tone: "coral" },
  { code: "en", name: "Inglés", native: "English", flag: "EN", tone: "blue" },
  { code: "zh", name: "Mandarín", native: "中文", flag: "中", tone: "red" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "हि", tone: "gold" },
  { code: "ar", name: "Árabe", native: "العربية", flag: "ع", tone: "green" },
  { code: "pt", name: "Portugués", native: "Português", flag: "PT", tone: "purple" },
  { code: "bn", name: "Bengalí", native: "বাংলা", flag: "বাং", tone: "teal" },
  { code: "ru", name: "Ruso", native: "Русский", flag: "РУ", tone: "indigo" },
  { code: "ja", name: "Japonés", native: "日本語", flag: "日", tone: "rose" },
  { code: "fr", name: "Francés", native: "Français", flag: "FR", tone: "amber" },
];

const LEVELS = [
  { code: "A1", label: "Descubrimiento", desc: "Frases cotidianas y bases esenciales", progress: 100 },
  { code: "A2", label: "Fundamentos", desc: "Interacciones sencillas con confianza", progress: 68 },
  { code: "B1", label: "Independencia", desc: "Conversaciones sobre temas familiares", progress: 24 },
  { code: "B2", label: "Fluidez", desc: "Ideas complejas y conversación natural", progress: 0 },
  { code: "C1", label: "Dominio", desc: "Comunicación flexible y precisa", progress: 0 },
  { code: "C2", label: "Maestría", desc: "Comprensión y expresión experta", progress: 0 },
];

const LESSONS = [
  { title: "Presentarte con naturalidad", module: "Conversación", time: "8 min", xp: "+25 XP", icon: Headphones, color: "bg-coral" },
  { title: "Los verbos esenciales", module: "Gramática", time: "12 min", xp: "+35 XP", icon: PencilLine, color: "bg-indigo" },
  { title: "Tu rutina diaria", module: "Vocabulario", time: "10 min", xp: "+30 XP", icon: BookOpen, color: "bg-teal" },
];

const EXERCISES = [
  { type: "Completar frase", question: "I ___ learning Spanish every day.", answer: "am", options: ["is", "am", "are", "be"] },
  { type: "Traducción", question: "Traduce: “Nos vemos mañana”", answer: "See you tomorrow", options: ["See you tomorrow", "Good night", "I see you today", "Until later"] },
  { type: "Opción múltiple", question: "¿Qué significa “to improve”?", answer: "Mejorar", options: ["Empezar", "Mejorar", "Recordar", "Escuchar"] },
];

function LanguageMark({ language, size = "md" }: { language: typeof LANGUAGES[number]; size?: "sm" | "md" | "lg" }) {
  return <span className={`language-mark ${size} tone-${language.tone}`} aria-label={language.name}>{language.flag}</span>;
}

function Metric({ icon: Icon, value, label, accent }: { icon: typeof Flame; value: string; label: string; accent: string }) {
  return <div className="metric-card"><div className={`metric-icon ${accent}`}><Icon size={18} /></div><div><strong>{value}</strong><span>{label}</span></div></div>;
}

function MediaShelf({ assets }: { assets: Array<{ id: number; kind: string; title: string; publicUrl: string; mimeType: string; license: string }> }) {
  if (!assets.length) return null;
  return <section className="media-shelf" aria-labelledby="media-shelf-title">
    <div><p className="eyebrow">Recursos verificados</p><h2 id="media-shelf-title">Escucha y observa en contexto</h2></div>
    <div className="media-grid">{assets.map((asset) => <article className="media-card" key={asset.id}>
      <div className="media-card-head"><Volume2 size={18} /><span>{asset.kind}</span></div>
      <h3>{asset.title}</h3>
      {asset.kind === "video" ? <video controls preload="metadata" src={asset.publicUrl}>{asset.title}</video> : <audio controls preload="metadata" src={asset.publicUrl}>{asset.title}</audio>}
      <small>Licencia: {asset.license}</small>
    </article>)}</div>
  </section>;
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [active, setActive] = useState("dashboard");
  const [target, setTarget] = useState("es");
  const { data: backendLanguages = [] } = trpc.languages.list.useQuery();
  const { data: progressSummary } = trpc.progress.summary.useQuery({ targetLanguageCode: target }, { enabled: isAuthenticated });
  const { data: srsQueue } = trpc.srs.queue.useQuery({ targetLanguageCode: target, limit: 24 }, { enabled: isAuthenticated });
  const { data: publishedMedia = [] } = trpc.media.published.useQuery({ languageCode: target });
  const availableLanguages = useMemo(() => backendLanguages.length ? LANGUAGES.map((language) => { const backend = backendLanguages.find((item) => item.code === language.code); return backend ? { ...language, name: backend.name, native: backend.nativeName } : language; }).filter((language) => backendLanguages.some((item) => item.code === language.code)) : LANGUAGES, [backendLanguages]);
  const [sourceLanguage, setSourceLanguage] = useState("pt");
  const { data: availablePaths = [] } = trpc.languages.paths.useQuery({ sourceCode: sourceLanguage, targetCode: target });
  const activePath = availablePaths[0];
  const [dark, setDark] = useState(false);
  const [diagnosticStep, setDiagnosticStep] = useState(0);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [exerciseChoice, setExerciseChoice] = useState<string | null>(null);
  const [practiceFilter, setPracticeFilter] = useState("Todos");
  const practiceLevel = (practiceFilter === "Todos" ? "A1" : practiceFilter) as "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  const { data: practiceExercises = [] } = trpc.practice.random.useQuery({ targetLanguageCode: target, level: practiceLevel, limit: 10 }, { enabled: isAuthenticated });
  const profileUpdate = trpc.profile.update.useMutation();
  const diagnosticStart = trpc.diagnostic.start.useMutation();

  const selectedLanguage = useMemo(() => availableLanguages.find((language) => language.code === target) ?? availableLanguages[0], [availableLanguages, target]);
  const backendExercise = practiceExercises[exerciseStep % Math.max(practiceExercises.length, 1)];
  const currentExercise = backendExercise ? { type: backendExercise.kind, question: backendExercise.prompt, answer: backendExercise.answer, options: Array.isArray(backendExercise.options) ? backendExercise.options.filter((option): option is string => typeof option === "string") : [] } : EXERCISES[exerciseStep % EXERCISES.length];

  const goTo = (next: string) => setActive(next);
  const selectExercise = (choice: string) => {
    setExerciseChoice(choice);
    if (choice === currentExercise.answer) toast.success("Respuesta correcta", { description: "+10 XP añadidos a tu progreso" });
    else toast.error("Casi. Revisa la explicación y vuelve a intentarlo.");
  };

  return (
    <div className={dark ? "app-shell dark-mode" : "app-shell"}>
      <header className="topbar">
        <button type="button" className="brand" onClick={() => goTo("dashboard")}>
          <div className="brand-mark"><Languages size={21} /></div>
          <span>Lingua<span>Forge</span></span>
        </button>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="Cambiar tema" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          {isAuthenticated ? <button className="profile-chip" onClick={() => goTo("profile")}><span className="avatar">{(user?.name ?? "A").slice(0, 1)}</span><span>{user?.name ?? "Mi perfil"}</span></button> : <Button onClick={() => startLogin()} className="button-dark">Entrar</Button>}
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar" aria-label="Navegación principal">
          <div className="sidebar-section"><span className="sidebar-label">APRENDER</span>
            <button className={active === "dashboard" ? "nav-item active" : "nav-item"} onClick={() => goTo("dashboard")}><LayoutDashboard size={18} />Resumen</button>
            <button className={active === "languages" ? "nav-item active" : "nav-item"} onClick={() => goTo("languages")}><Globe2 size={18} />Mis idiomas <span className="nav-count">2</span></button>
            <button className={active === "practice" ? "nav-item active" : "nav-item"} onClick={() => goTo("practice")}><WandSparkles size={18} />Práctica libre</button>
            <button className={active === "review" ? "nav-item active" : "nav-item"} onClick={() => goTo("review")}><BrainCircuit size={18} />Repaso SRS <span className="nav-dot" /></button>
          </div>
          <div className="sidebar-section"><span className="sidebar-label">TU CUENTA</span><button className={active === "profile" ? "nav-item active" : "nav-item"} onClick={() => goTo("profile")}><CircleUserRound size={18} />Perfil y preferencias</button></div>
          <div className="sidebar-bottom"><div className="sidebar-tip"><Sparkles size={17} /><div><strong>Un poco cada día</strong><span>La constancia vence al talento.</span></div></div><div className="open-source-note">Código y contenido abierto<br /><span>Hecho para aprender juntos.</span></div></div>
        </aside>

        <main className="main-content">
          <div className="content-wrap">
            {active === "dashboard" && <>
              <div className="page-heading"><div><p className="eyebrow">MI ESPACIO DE APRENDIZAJE</p><h1>Buenos días{user?.name ? `, ${user.name.split(" ")[0]}` : ""}. <em>Sigamos.</em></h1><p className="subheading">Tu próxima conversación empieza con una pequeña práctica.</p></div><Button onClick={() => goTo("practice")} className="button-coral"><Play size={16} fill="currentColor" />Continuar aprendiendo</Button></div>
              <div className="metric-grid"><Metric icon={Flame} value={`${progressSummary?.streakDays ?? 0} días`} label="Racha actual" accent="coral" /><Metric icon={Zap} value={(progressSummary?.xp ?? 0).toLocaleString("es-ES")} label="XP acumulada" accent="gold" /><Metric icon={BookOpen} value={String(progressSummary?.lessonsCompleted ?? 0)} label="Lecciones hechas" accent="indigo" /><Metric icon={Target} value={progressSummary?.currentLevel ?? "A1"} label={`Nivel actual · ${selectedLanguage.code.toUpperCase()}`} accent="teal" /></div>
              <div className="dashboard-grid">
                <Card className="progress-card"><CardHeader><div className="card-heading-row"><div><p className="eyebrow">TU RUTA · {selectedLanguage.name.toUpperCase()}</p><CardTitle>Mapa de progreso</CardTitle></div><Select value={target} onValueChange={setTarget}><SelectTrigger className="language-select"><SelectValue /></SelectTrigger><SelectContent>{availableLanguages.map((language) => <SelectItem key={language.code} value={language.code}>{language.native}</SelectItem>)}</SelectContent></Select></div></CardHeader><CardContent><div className="level-list">{LEVELS.map((level, index) => <div className={`level-row ${level.progress > 0 ? "unlocked" : "locked"}`} key={level.code}><div className="level-badge">{level.progress === 100 ? <Check size={16} /> : level.progress > 0 ? level.code : <LockKeyhole size={14} />}</div><div className="level-copy"><div><strong>{level.code} · {level.label}</strong><span>{level.desc}</span></div>{level.progress > 0 && <div className="level-progress"><Progress value={level.progress} /><small>{level.progress}%</small></div>}</div><ChevronRight size={18} className="level-arrow" /></div>)}</div></CardContent></Card>
                <Card className="today-card"><CardHeader><p className="eyebrow">PARA HOY</p><CardTitle>Tu siguiente paso</CardTitle><CardDescription>Una sesión breve para mantener el ritmo.</CardDescription></CardHeader><CardContent><div className="today-lesson"><div className="today-icon"><Headphones size={22} /></div><div><Badge variant="secondary">CONVERSACIÓN · A2</Badge><h3>Presentarte con naturalidad</h3><p>Aprende a hablar de ti en situaciones cotidianas.</p><div className="lesson-meta"><span>8 minutos</span><span>+25 XP</span></div></div></div><Button className="button-dark full-button" onClick={() => goTo("lesson")}>Empezar lección <ArrowRight size={16} /></Button></CardContent></Card>
              </div>
              <div className="section-heading"><div><p className="eyebrow">CONTINÚA TU RUTA</p><h2>Lecciones recomendadas</h2></div><button className="text-link" onClick={() => goTo("languages")}>Ver mapa completo <ArrowRight size={15} /></button></div><div className="lesson-grid">{LESSONS.map((lesson) => <button type="button" className="lesson-card" key={lesson.title} onClick={() => goTo("lesson")}><div className={`lesson-card-icon ${lesson.color}`}><lesson.icon size={20} /></div><div className="lesson-card-body"><Badge variant="outline">{lesson.module}</Badge><h3>{lesson.title}</h3><p>{lesson.time} · {lesson.xp}</p></div><ChevronRight size={18} className="lesson-arrow" /></button>)}</div>
            </>}

            {active === "languages" && <><div className="page-heading"><div><p className="eyebrow">MIS IDIOMAS</p><h1>Elige tu <em>próximo mundo.</em></h1><p className="subheading">Cada idioma abre una nueva forma de mirar.</p></div><div className="pair-route"><span>{activePath ? `${activePath.sourceName} → ${activePath.targetName}` : "Ruta bidireccional"}</span><Select value={sourceLanguage} onValueChange={setSourceLanguage}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{availableLanguages.map((language) => <SelectItem key={language.code} value={language.code}>{language.native}</SelectItem>)}</SelectContent></Select><ArrowRight size={15} /><Select value={target} onValueChange={setTarget}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{availableLanguages.filter((language) => language.code !== sourceLanguage).map((language) => <SelectItem key={language.code} value={language.code}>{language.native}</SelectItem>)}</SelectContent></Select><small>{activePath ? `${activePath.entryCount ?? 0} entradas` : "Preparando ruta"}</small></div></div><div className="language-grid">{availableLanguages.map((language, index) => <button type="button" className={`language-card ${index < 2 ? "selected" : ""}`} key={language.code} onClick={() => { setTarget(language.code); goTo("dashboard"); }}><div className="language-card-top"><LanguageMark language={language} size="lg" />{index < 2 ? <Badge className="status-badge">En curso</Badge> : <Badge variant="outline">Explorar</Badge>}</div><h3>{language.native}</h3><p>{language.name} · {language.code.toUpperCase()}</p>{index < 2 ? <><div className="language-card-progress"><Progress value={index === 0 ? 62 : 18} /><span>{index === 0 ? "B1" : "A1"}</span></div><small>{index === 0 ? "62% del nivel actual" : "Comenzando"}</small></> : <div className="language-cta">Iniciar diagnóstico <ArrowRight size={15} /></div>}</button>)}</div><Card className="diagnostic-banner"><div className="diagnostic-illustration"><Target size={32} /></div><div><p className="eyebrow">NUEVO IDIOMA</p><h2>Empieza con una evaluación que te entiende.</h2><p>El diagnóstico adapta la ruta a lo que ya sabes, sin hacerte repetir lo obvio.</p></div><Button className="button-dark" onClick={() => setDiagnosticStep(0)}>Hacer diagnóstico <ArrowRight size={16} /></Button></Card></>}

            {active === "practice" && <><div className="page-heading"><div><p className="eyebrow">PRÁCTICA LIBRE</p><h1>Entrena lo que <em>necesitas.</em></h1><p className="subheading">Sesiones aleatorias para reforzar cualquier área de tu ruta.</p></div><div className="practice-streak"><Flame size={18} />7 días de racha</div></div><Card className="practice-panel"><div className="practice-filters"><div><label htmlFor="practice-language">Idioma</label><Select value={target} onValueChange={setTarget}><SelectTrigger id="practice-language"><SelectValue /></SelectTrigger><SelectContent>{availableLanguages.map((language) => <SelectItem key={language.code} value={language.code}>{language.native}</SelectItem>)}</SelectContent></Select></div><div><label htmlFor="practice-level">Nivel</label><Select value={practiceFilter} onValueChange={setPracticeFilter}><SelectTrigger id="practice-level"><SelectValue /></SelectTrigger><SelectContent>{["Todos", ...LEVELS.map((level) => level.code)].map((level) => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent></Select></div><div><label htmlFor="practice-topic">Tema</label><Select defaultValue="Todos"><SelectTrigger id="practice-topic"><SelectValue /></SelectTrigger><SelectContent>{["Todos", "Vida cotidiana", "Viajes", "Trabajo", "Conversación"].map((topic) => <SelectItem key={topic} value={topic}>{topic}</SelectItem>)}</SelectContent></Select></div></div><div className="practice-divider" /><div className="practice-start"><div className="practice-orbit"><BrainCircuit size={33} /></div><div><h2>Una práctica hecha para hoy</h2><p>{practiceExercises.length || 10} ejercicios · Vocabulario y conversación · {practiceFilter === "Todos" ? "Todos los niveles" : practiceFilter}</p></div><Button className="button-coral" onClick={() => goTo("exercise")}>Comenzar <ArrowRight size={16} /></Button></div></Card><div className="section-heading compact"><div><p className="eyebrow">FORMATOS</p><h2>Entrena cada destreza</h2></div></div><div className="skill-grid">{[{ icon: BookOpen, title: "Vocabulario", desc: "Palabras que se quedan", color: "teal" }, { icon: PencilLine, title: "Gramática", desc: "Estructuras que fluyen", color: "indigo" }, { icon: Volume2, title: "Pronunciación", desc: "Sonar con naturalidad", color: "coral" }, { icon: Headphones, title: "Conversación", desc: "Usar el idioma de verdad", color: "gold" }].map((item) => <button type="button" key={item.title} className="skill-card" onClick={() => goTo("exercise")}><div className={`skill-icon ${item.color}`}><item.icon size={20} /></div><h3>{item.title}</h3><p>{item.desc}</p><ArrowRight size={16} /></button>)}</div></>}

            {active === "review" && <><div className="page-heading"><div><p className="eyebrow">REPETICIÓN ESPACIADA</p><h1>Recuerda más, <em>esfúerzate menos.</em></h1><p className="subheading">Tu memoria tiene un ritmo. Nosotros lo seguimos.</p></div><div className="review-count"><strong>{srsQueue?.dueCount ?? 0}</strong><span>tarjetas pendientes</span></div></div><Card className="review-hero"><div className="review-hero-icon"><BrainCircuit size={28} /></div><div><p className="eyebrow">SESIÓN DE HOY</p><h2>{srsQueue?.dueCount ?? 0} tarjetas listas para repasar</h2><p>Una sesión de 8 minutos mantiene activas tus palabras más importantes.</p><div className="review-stats"><span><strong>{Math.ceil((srsQueue?.dueCount ?? 0) / 2)}</strong> nuevas</span><span><strong>{Math.floor((srsQueue?.dueCount ?? 0) / 2)}</strong> para reforzar</span></div></div><Button className="button-dark" onClick={() => goTo("review-session")}>Repasar ahora <ArrowRight size={16} /></Button></Card><div className="section-heading compact"><div><p className="eyebrow">TU RITMO</p><h2>Memoria en movimiento</h2></div></div><div className="memory-grid"><Card><CardHeader><CardTitle>Retención estimada</CardTitle><CardDescription>Últimos 30 días</CardDescription></CardHeader><CardContent><div className="retention-number">86<span>%</span></div><Progress value={86} className="tall-progress" /><p className="muted-text">+8% frente al mes anterior</p></CardContent></Card><Card><CardHeader><CardTitle>Próximas revisiones</CardTitle><CardDescription>Distribución de tu cola</CardDescription></CardHeader><CardContent><div className="review-bars"><div><span>Hoy</span><Progress value={72} /><strong>24</strong></div><div><span>Mañana</span><Progress value={43} /><strong>14</strong></div><div><span>Esta semana</span><Progress value={28} /><strong>8</strong></div></div></CardContent></Card></div></>}

            {active === "lesson" && <LessonView onBack={() => goTo("dashboard")} onDone={() => { toast.success("Lección completada", { description: "+25 XP y progreso actualizado" }); goTo("dashboard"); }} />}
            {active === "exercise" && <ExerciseView exercise={currentExercise} choice={exerciseChoice} onChoice={selectExercise} onNext={() => { setExerciseStep((step) => step + 1); setExerciseChoice(null); }} onBack={() => goTo("practice")} />}
            {active === "review-session" && <ReviewView onBack={() => goTo("review")} />}
            {active === "profile" && <ProfileView userName={user?.name ?? "Alex"} target={target} languages={availableLanguages} onTargetChange={setTarget} onSave={() => profileUpdate.mutate({ name: user?.name ?? "Alex", nativeLanguageCode: "es" }, { onSuccess: () => toast.success("Preferencias guardadas") })} />}
          </div>
        </main>
        <MediaShelf assets={publishedMedia} />
        <footer className="app-footer">LinguaForge · Proyecto firmado por Pedro Belentani · <a href="https://belentani.eu" target="_blank" rel="noreferrer">belentani.eu</a></footer>
      </div>
      {diagnosticStep === 0 && active === "languages" && <DiagnosticModal onClose={() => setDiagnosticStep(-1)} onStart={() => { diagnosticStart.mutate({ targetLanguageCode: target }); setDiagnosticStep(1); toast("Diagnóstico preparado", { description: "Son 8 preguntas y tardarás unos 4 minutos." }); }} />}
    </div>
  );
}

function LessonView({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  return <div className="lesson-view"><button className="back-link" onClick={onBack}>← Volver al resumen</button><div className="lesson-progress-head"><span>Lección 1 de 4</span><span>25% completado</span></div><Progress value={25} /><div className="lesson-intro"><Badge>CONVERSACIÓN · A2</Badge><h1>Presentarte con naturalidad</h1><p>Aprende a hablar de ti en situaciones cotidianas, con frases que usarás desde el primer día.</p></div><Card className="lesson-activity"><div className="activity-top"><span>01 / 04</span><Badge variant="outline">Escucha y repite</Badge></div><div className="listen-card"><button className="play-circle" aria-label="Reproducir audio"><Volume2 size={24} /></button><div><strong>My name is Alex.</strong><span>Mi nombre es Alex.</span></div><button className="small-icon" aria-label="Repetir audio"><RotateCcw size={16} /></button></div><div className="activity-question"><p>Escucha la frase y selecciona su significado.</p><div className="answer-grid"><Button variant="outline">Me llamo Alex.</Button><Button variant="outline">Vivo con Alex.</Button><Button variant="outline">Conozco a Alex.</Button><Button variant="outline">Alex es mi amigo.</Button></div></div><Button className="button-coral full-button" onClick={onDone}>Comprobar respuesta <Check size={16} /></Button></Card></div>;
}

function ExerciseView({ exercise, choice, onChoice, onNext, onBack }: { exercise: typeof EXERCISES[number]; choice: string | null; onChoice: (choice: string) => void; onNext: () => void; onBack: () => void }) {
  return <div className="exercise-view"><button className="back-link" onClick={onBack}>← Volver a práctica libre</button><div className="exercise-progress"><Progress value={52} /><span>Pregunta 3 de 10</span></div><Card className="exercise-card"><div className="exercise-label"><Badge>{exercise.type}</Badge><span>+10 XP</span></div><h1>{exercise.question}</h1><div className="option-list">{exercise.options.map((option) => <button key={option} className={`option-button ${choice === option ? option === exercise.answer ? "correct" : "wrong" : ""}`} onClick={() => onChoice(option)}>{option}{choice === option && option === exercise.answer && <Check size={18} />}</button>)}</div>{choice && <div className={`answer-feedback ${choice === exercise.answer ? "success" : "error"}`}><strong>{choice === exercise.answer ? "Muy bien." : "Aún no."}</strong><span>{choice === exercise.answer ? "Tu respuesta es correcta." : `La respuesta correcta es “${exercise.answer}”.`}</span></div>}<Button className="button-dark full-button" disabled={!choice} onClick={onNext}>{choice ? "Siguiente ejercicio" : "Elige una respuesta"} <ArrowRight size={16} /></Button></Card></div>;
}

function ReviewView({ onBack }: { onBack: () => void }) {
  const [revealed, setRevealed] = useState(false);
  return <div className="review-view"><button className="back-link" onClick={onBack}>← Volver a repaso</button><div className="exercise-progress"><Progress value={18} /><span>5 de 24 tarjetas</span></div><Card className="flashcard"><div className="flashcard-top"><Badge variant="outline">ESPAÑOL · A2</Badge><span>Vida cotidiana</span></div><div className="flashcard-word"><span>to improve</span>{revealed && <strong>mejorar</strong>}</div>{!revealed ? <Button className="button-coral" onClick={() => setRevealed(true)}>Mostrar respuesta <EyeIcon /></Button> : <div className="rating-row"><span>¿Qué tan fácil fue?</span><div><Button variant="outline" onClick={() => setRevealed(false)}>Otra vez</Button><Button variant="outline" onClick={() => setRevealed(false)}>Difícil</Button><Button className="button-dark" onClick={() => setRevealed(false)}>Bien</Button><Button className="button-coral" onClick={() => setRevealed(false)}>Fácil</Button></div></div>}</Card></div>;
}
function EyeIcon() { return <Search size={16} />; }

function ProfileView({ userName, target, languages, onTargetChange, onSave }: { userName: string; target: string; languages: typeof LANGUAGES; onTargetChange: (value: string) => void; onSave: () => void }) {
  return <div className="profile-view"><div className="page-heading"><div><p className="eyebrow">TU CUENTA</p><h1>Tu perfil, <em>a tu medida.</em></h1><p className="subheading">Configura tu experiencia de aprendizaje.</p></div></div><Card className="profile-card"><div className="profile-avatar">{userName.slice(0, 1)}</div><div className="profile-fields"><label htmlFor="profile-name">Nombre visible</label><Input id="profile-name" defaultValue={userName} /><label htmlFor="profile-native">Idioma nativo</label><Select defaultValue="es"><SelectTrigger id="profile-native"><SelectValue /></SelectTrigger><SelectContent>{languages.map((language) => <SelectItem key={language.code} value={language.code}>{language.native}</SelectItem>)}</SelectContent></Select><label htmlFor="profile-target">Idioma objetivo principal</label><Select value={target} onValueChange={onTargetChange}><SelectTrigger id="profile-target"><SelectValue /></SelectTrigger><SelectContent>{languages.map((language) => <SelectItem key={language.code} value={language.code}>{language.native}</SelectItem>)}</SelectContent></Select><Button className="button-coral" onClick={onSave}>Guardar cambios</Button></div></Card></div>;
}

function DiagnosticModal({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="diagnostic-title"><Card className="diagnostic-modal"><button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button><div className="modal-icon"><Target size={24} /></div><p className="eyebrow">DIAGNÓSTICO INICIAL</p><h2 id="diagnostic-title">Empieza desde donde estás.</h2><p>Ocho preguntas para estimar tu nivel actual de {"español"}. No es un examen: es el punto de partida de una ruta que se adapta a ti.</p><div className="diagnostic-details"><span><ClockIcon />4 minutos</span><span><Target size={15} />8 preguntas</span><span><Trophy size={15} />Sin presión</span></div><Button className="button-coral full-button" onClick={onStart}>Comenzar diagnóstico <ArrowRight size={16} /></Button></Card></div>;
}
function ClockIcon() { return <span className="clock-icon">◷</span>; }
