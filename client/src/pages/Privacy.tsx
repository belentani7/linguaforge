import { InstitutionShell } from "@/components/InstitutionShell";
import { ArrowRight, Database, Eye, Mic, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

const topics = [
  {
    Icon: Database,
    title: "Progreso y preferencias",
    body: "Las actividades que marcas como completadas sin cuenta se guardan en el almacenamiento de este navegador. No se sincronizan con otros dispositivos. Si borras los datos del sitio, puedes perder este avance. La sincronización de cuentas requiere un backend disponible.",
  },
  {
    Icon: Mic,
    title: "Grabación y transcripción",
    body: "El micrófono solo se solicita cuando decides grabarte. Como invitado puedes escuchar la toma en el mismo navegador, sin enviarla automáticamente. Con sesión, pulsar Transcribir y comparar solicita el servicio del servidor; no se garantiza su disponibilidad.",
  },
  {
    Icon: Eye,
    title: "Tutor y herramientas",
    body: "La guía local utiliza reglas y un microglosario de alcance limitado: el texto no necesita salir del dispositivo. Si usas la versión con sesión, las solicitudes de tutor pueden procesarse en el servidor. No introduzcas contraseñas ni datos especialmente sensibles.",
  },
] as const;

export default function Privacy() {
  return (
    <InstitutionShell>
      <section className="page-hero">
        <p className="eyebrow">LinguaForge / Transparencia</p>
        <h1>Privacidad, control y <em>límites visibles.</em></h1>
        <p>Esta página explica cómo se comporta la versión actual de la aplicación. No constituye una declaración de cumplimiento legal ni sustituye una política institucional completa.</p>
      </section>
      <section className="section-wrap open-commitments" aria-label="Tratamientos y control">
        {topics.map(({ Icon, title, body }) => (
          <article key={title}><Icon size={23} aria-hidden="true" /><h2>{title}</h2><p>{body}</p></article>
        ))}
      </section>
      <section className="section-wrap open-statement">
        <div>
          <p className="eyebrow">Control del usuario</p>
          <h2>Decides qué utilizar.</h2>
          <p>El progreso local y las preferencias pueden eliminarse desde la configuración de datos del sitio del navegador. La grabación no se envía automáticamente en modo invitado y se descarta al cerrar la sesión de navegación o recargar la página.</p>
          <p>Para operar públicamente como plataforma institucional todavía es necesario documentar responsables del tratamiento, proveedores, retención, derechos, transferencias internacionales y canales de contacto, según corresponda.</p>
        </div>
        <div className="open-faculty-list">
          <Link href="/programas"><span>01</span><div><strong>Estudiar sin cuenta</strong><small>Accede al catálogo y a las lecciones disponibles localmente.</small></div><ArrowRight size={16} /></Link>
          <Link href="/tutor"><span>02</span><div><strong>Usar la guía local</strong><small>Orientación educativa sin modelo generativo.</small></div><ArrowRight size={16} /></Link>
          <Link href="/biblioteca"><span>03</span><div><strong>Consultar materiales</strong><small>Revisa fuentes y estado de traducción.</small></div><ArrowRight size={16} /></Link>
        </div>
      </section>
      <section className="section-wrap open-commitments"><article><ShieldCheck size={23} aria-hidden="true" /><h2>Sin certificación ni perfilamiento sensible</h2><p>Las prácticas educativas no certifican niveles MCER/CEFR ni toman decisiones automatizadas sobre el empleo, la salud o la situación legal de las personas. La información importante debe contrastarse con una fuente oficial o profesional.</p></article></section>
    </InstitutionShell>
  );
}
