import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import PageTransition from "./PageTransition";
import SiteNav from "./SiteNav";
import Hero from "./Hero";
import { HERO_SCHEDULE } from "./heroTiming";
import ServicesReveal from "./ServicesReveal";
import ElasticGallery from "./ElasticGallery";
import EbookBanner from "./EbookBanner";
import PromoBar from "./PromoBar";
import SpotlightCarousel from "./SpotlightCarousel";
import FAQs from "./FAQs";
import CtaCard from "./CtaCard";
import Footer from "./Footer";
import TrainingPage from "./TrainingPage";
import { findTraining } from "./trainings";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import MentionsLegales from "./MentionsLegales";
import Confidentialite from "./Confidentialite";
import CGV from "./CGV";
import NotFound from "./NotFound";
import Seo from "./Seo";
import { SITE } from "./config/site";
import { C } from "./theme";

// la navigation descend en même temps que la dernière phase du hero
const NAV_DELAY = HERO_SCHEDULE.phase3;

function Anchor({ id, children }) {
  return (
    <div
      id={id}
      data-section={id}
      style={{ scrollMarginTop: "calc(var(--nav-height, 80px) + 16px)" }}
    >
      {children}
    </div>
  );
}

function Home() {
  return (
    <>
      <Seo path="/" />

      <Hero />
      <main>
        <Anchor id="pose-de-cils">
          <ServicesReveal />
        </Anchor>

        <PromoBar className="mt-6 md:mt-10" />

        <Anchor id="prestations">
          <SpotlightCarousel />
        </Anchor>

        <Anchor id="ebook">
          <EbookBanner />
        </Anchor>

        <Anchor id="formations">
          <ElasticGallery />
        </Anchor>

        <Anchor id="faq">
          <FAQs />
        </Anchor>

        <CtaCard primary={{ label: "Voir les formations", href: "/#formations" }} />
      </main>
    </>
  );
}

function Training() {
  const { slug } = useParams();
  return <TrainingPage training={findTraining(slug)} bookingHref={SITE.booking} />;
}

export default function App() {
  return (
    // pas d'overflow-hidden sur les parents : cela casserait le position:sticky
    <BrowserRouter>
      <PageTransition brand="DOLLYLASHESSTUDIO">
        <div className="min-h-screen" style={{ backgroundColor: C.surface }}>

          <SiteNav revealDelay={NAV_DELAY} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/formations/:slug" element={<Training />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-de-confidentialite" element={<Confidentialite />} />
            <Route path="/conditions-generales-de-vente" element={<CGV />} />
            {/* filet : toute adresse inconnue arrive ici */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </div>
      </PageTransition>
    </BrowserRouter>
  );
}
