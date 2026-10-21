import { InstitutionShell } from "@/components/InstitutionShell";
import { ArrowRight, BookOpenCheck, BrainCircuit, ShieldCheck, Scale } from "lucide-react";
import { Link } from "wouter";

const faculties = [
  { title: "Lenguas y comunicación", activity: "Preparar una petición oral breve y revisar su transcripción.", outcome: "Comprender, expresarse y conversar en contexto." },
  { title: "Ciudadanía digital", activity: "Examinar procedencia, fecha y propósito antes de compartir información.", outcome: "Distinguir fuentes y evaluar riesgos." },
  { title: "Tecnología aplicada", activity: "Escribir un correo útil y reconocer direcciones web seguras.", outcome: "Resolver tareas digitales y proteger cuentas." },
  { title: "Programación creativa", activity: "Leer un programa sencillo y cambiar el resultado.", outcome: "Entender lógica y construir soluciones." },
  { title: "IA responsable", activity: "Diseñar una consulta y comprobar la respuesta con otras fuentes.", outcome: "Usar IA sin delegar el criterio." },
  { title: "Trayectorias profesionales", activity: "Preparar un CV local y practicar una entrevista.", outcome: "Demostrar capacidades con ejemplos." },
];

const providers = [
  { name: "Tutor de apoyo", today: "Adaptador de aplicación y respuesta determinista cuando el proveedor no está disponible.", limits: "El modo demostración no constituye una evaluación oficial ni una respuesta generativa verificada." },
  { name: "Práctica oral", today: "Transcripción cuando existe servicio configurado; alternativa manual por escrito.", limits: "El micrófono requiere permiso y la configuración del servidor determina el tratamiento de grabaciones." },
  { name: "Lectura de voz", today: "Texto visible y tecnologías asistivas del navegador.", limits: "No se anuncia un motor propio de síntesis de voz en esta entrega." },
  { name: "Búsqueda de recursos", today: "Índice curado y búsqueda por palabras y categorías.", limits: "La búsqueda semántica y RAG están proyectados, no operativos." },
];

const privacy = [
  { name: "Idioma y ruta", use: "Adaptar el diagnóstico y el recorrido", handling: "Preferencias del dispositivo o perfil autenticado según función" },
  { name: "Progreso", use: "Mostrar actividades completadas", handling: "Guardado de cuenta cuando está habilitada la autenticación" },
  { name: "Tutor", use: "Proponer apoyo educativo", handling: "Mensajes procesados por el servicio configurado, con límites de uso" },
  { name: "Voz", use: "Transcribir práctica elegida por la persona", handling: "Permiso de micrófono y posible almacenamiento de audio en servidor" },
  { name: "Herramientas locales", use: "Escribir un CV o guardar marcadores", handling: "Parte de los datos se conserva solo en el navegador" },
];

export default function Transparency() {
  return (
    <InstitutionShell>
      <section className="page-hero">
        <p className="eyebrow">LinguaForge / Documentación abierta</p>
        <h1>Qué existe.<br /><em>Qué falta. Qué protegemos.</em></h1>
        <p>Las herramientas se explican en lenguaje claro. Un idioma presente en el catálogo no implica un curso completo, y una función proyectada no se presenta como operativa.</p>
      </section>
      <nav className="section-wrap flex flex-wrap gap-3" aria-label="Secciones de transparencia">
        {[
          { id: "modelo", label: "Modelo educativo" },
          { id: "ia", label: "IA y límites" },
          { id: "privacidad", label: "Privacidad" },
          { id: "licencia", label: "Licencia" },
        ].map((item) => <a key={item.id} href={`#${item.id}`} className="rounded-full border border-current/20 px-4 py-2 text-sm underline-offset-4 hover:underline">{item.label}</a>)}
      </nav>
      <section id="modelo" className="section-wrap py-10" aria-labelledby="modelo-title">
        <p className="eyebrow">01 / Modelo institucional</p>
        <h2 id="modelo-title" className="mb-4 text-3xl font-semibold tracking-tight">Seis facultades conectadas</h2>
        <p className="max-w-3xl leading-8">Las situaciones reales mezclan lenguaje, herramientas digitales y capacidad de decisión. El diagnóstico de nivel MCER es orientativo; no es una acreditación. Puedes cambiar de ruta en cualquier momento.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faculties.map((item, i) => <article key={item.title} className="rounded-2xl border border-current/15 p-6">
            <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 text-xl font-semibold">{item.title}</h3><p>{item.outcome}</p><p className="text-sm opacity-75">Ejemplo: {item.activity}</p>
          </article>)}
        </div>
        <Link className="mt-8 inline-flex items-center gap-2 underline underline-offset-4" href="/programas">Explorar programas reales <ArrowRight size={16} /></Link>
      </section>
      <section id="ia" className="section-wrap py-10" aria-labelledby="ia-title">
        <p className="eyebrow">02 / Arquitectura y límites</p>
        <h2 id="ia-title" className="mb-4 flex items-center gap-3 text-3xl font-semibold"><BrainCircuit aria-hidden="true" /> IA sin promesas vacías</h2>
        <p className="max-w-3xl leading-8">AI Core separa las funciones educativas de sus proveedores. Un proveedor no configurado no se disfraza de servicio activo; los fallos deben permitir continuar sin perder trabajo.</p>
        <div className="mt-7 grid gap-4 md:grid-cols-2">{providers.map((item) => <article key={item.name} className="rounded-2xl border border-current/15 p-6">
          <h3 className="mb-3 text-lg font-semibold">{item.name}</h3><p>{item.today}</p><p className="text-sm opacity-75">{item.limits}</p>
        </article>)}</div>
        <p className="mt-6 text-sm">No se certifican niveles, no se ofrecen consejos individuales de alto impacto ni se garantiza que las respuestas de IA sean correctas. Contrasta los datos importantes.</p>
      </section>
      <section id="privacidad" className="section-wrap py-10" aria-labelledby="privacy-title">
        <p className="eyebrow">03 / Datos personales</p>
        <h2 id="privacy-title" className="mb-4 flex items-center gap-3 text-3xl font-semibold"><ShieldCheck aria-hidden="true" /> El control empieza por saber qué se guarda</h2>
        <p className="max-w-3xl leading-8">Los datos de estudio y voz no deben utilizarse para elaborar perfiles psicológicos, diagnósticos de salud ni decisiones automáticas de empleo. No introduzcas datos sensibles en un tutor.</p>
        <div className="mt-7 overflow-x-auto"><table className="w-full min-w-[560px] border-collapse text-left text-sm"><caption className="sr-only">Uso y tratamiento general de datos</caption><thead><tr className="border-b border-current/25"><th scope="col" className="p-3">Datos</th><th scope="col" className="p-3">Finalidad</th><th scope="col" className="p-3">Tratamiento</th></tr></thead><tbody>{privacy.map((entry) => <tr className="border-b border-current/15" key={entry.name}><th scope="row" className="p-3 font-semibold">{entry.name}</th><td className="p-3">{entry.use}</td><td className="p-3">{entry.handling}</td></tr>)}</tbody></table></div>
        <p className="mt-5 text-sm">Información técnica orientativa, no una política jurídica definitiva. Antes de un servicio institucional se requiere concretar responsable, base legal, conservación, derechos y protección de menores.</p>
      </section>
      <section id="licencia" className="section-wrap py-10" aria-labelledby="license-title">
        <p className="eyebrow">04 / Procedencia y permisos</p>
        <h2 id="license-title" className="mb-4 flex items-center gap-3 text-3xl font-semibold"><Scale aria-hidden="true" /> Licencia del código</h2>
        <p className="max-w-3xl leading-8">El repositorio contiene un archivo de licencia MIT, Copyright © 2026 Pedro Belentani. Permite utilizar, modificar y distribuir el software conservando el aviso de derechos y la licencia correspondiente. Se proporciona sin garantía. Las bibliotecas y materiales de terceros conservan sus licencias particulares.</p>
        <p className="max-w-3xl">Que el código tenga licencia MIT no significa que todos sus recursos o repositorios privados sean públicos. No se atribuyen a estudiantes certificados, títulos ni logros sin evidencia.</p>
        <Link href="/biblioteca" className="mt-5 inline-flex items-center gap-2 underline underline-offset-4"><BookOpenCheck size={18} /> Explorar recursos del aprendizaje</Link>
      </section>
      <section className="section-wrap my-10 rounded-2xl border border-current/20 p-7" aria-label="Próximo paso"><h2 className="text-2xl font-semibold">Aprende comprobando.</h2><p>Esta documentación explica los límites del producto; la actividad educativa ocurre en el catálogo, los programas y las lecciones disponibles.</p><Link href="/catalogo" className="inline-flex items-center gap-2 underline underline-offset-4">Ir al catálogo <ArrowRight size={16} /></Link></section>
    </InstitutionShell>
  );
}
