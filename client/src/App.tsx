import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { applySeo } from "./lib/seo";
import Catalog from "./pages/Catalog";
import Transparency from "./pages/Transparency";
import Dashboard from "./pages/Dashboard";
import Employment from "./pages/Employment";
import EvidenceRecord from "./pages/EvidenceRecord";
import Labs from "./pages/Labs";
import Lesson from "./pages/Lesson";
import Library from "./pages/Library";
import Onboarding from "./pages/Onboarding";
import OpenInstitution from "./pages/OpenInstitution";
import Programs from "./pages/Programs";
import Projects from "./pages/Projects";
import Tutor from "./pages/Tutor";
import VoiceLanding from "./pages/VoiceLanding";
import VoicePractice from "./pages/VoicePractice";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";

/** Sincroniza título, descripción, canonical y robots con la ruta activa. */
function SeoSync() {
  const [location] = useLocation();
  useEffect(() => applySeo(location), [location]);
  return null;
}

/** Mapa de rutas. Las rutas con parámetros usan los mismos patrones que `useRoute` en cada página. */
export default function App() {
  return (
    <>
    <SeoSync />
    <Switch>
      <Route path="/" component={OpenInstitution} />
      <Route path="/catalogo" component={Catalog} />
      <Route path="/transparencia" component={Transparency} />
      <Route path="/programas" component={Programs} />
      <Route path="/lecciones/:id" component={Lesson} />
      <Route path="/practica-oral/:id" component={VoicePractice} />
      <Route path="/voz" component={VoiceLanding} />
      <Route path="/diagnostico" component={Onboarding} />
      <Route path="/mi-espacio" component={Dashboard} />
      <Route path="/mi-constancia" component={EvidenceRecord} />
      <Route path="/tutor" component={Tutor} />
      <Route path="/proyectos" component={Projects} />
      <Route path="/biblioteca" component={Library} />
      <Route path="/laboratorios" component={Labs} />
      <Route path="/empleo" component={Employment} />
      <Route path="/privacidad" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
    </>
  );
}
