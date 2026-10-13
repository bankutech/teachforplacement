import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

const templates = {
  'northern-fjords': lazy(() => import('./templates/Northern_Fjords')),
  'rainforest-canopy': lazy(() => import('./templates/Rainforest_Canopy/index.jsx')),
  'duotone-bold': lazy(() => import('./templates/Duotone_Bold/index.jsx')),
  'chromatic-glitch': lazy(() => import('./templates/Chromatic_Glitch/index.jsx')),
  'swiss-typography': lazy(() => import('./templates/Swiss_Typography/index.jsx')),
  'desert-dunes': lazy(() => import('./templates/Desert_Dunes/index.jsx')),
  'psychedelic-swirl': lazy(() => import('./templates/Psychedelic_Swirl/index.jsx')),
  'memphis-pop': lazy(() => import('./templates/Memphis_Pop/index.jsx')),
  'hidden-easter-egg-scavenger-hunt': lazy(() => import('./templates/Hidden_Easter_Egg_Scavenger_Hunt/index.jsx')),
  'cassette-mixtape': lazy(() => import('./templates/Cassette_Mixtape/index.jsx')),
  'magnetic-dock': lazy(() => import('./templates/Magnetic_Dock/index.jsx')),
  'color-block': lazy(() => import('./templates/Color_Block/index.jsx')),
  'ocean-depths': lazy(() => import('./templates/Ocean_Depths/index.jsx')),
  'neon-cityscape': lazy(() => import('./templates/Neon_Cityscape/index.jsx')),
  'planetary-orbit': lazy(() => import('./templates/Planetary_Orbit/index.jsx')),
  'low-poly-terrain': lazy(() => import('./templates/Low_Poly_Terrain/index.jsx')),
  'high-fashion': lazy(() => import('./templates/High_Fashion/index.jsx')),
  'typographic-wheatpaste-poster-wall': lazy(() => import('./templates/Typographic_Wheatpaste_Poster_Wall/index.jsx')),
  'digital-manifesto-scroll': lazy(() => import('./templates/Digital_Manifesto_Scroll/index.jsx')),
  'zine-collage': lazy(() => import('./templates/ZineCollage')),
  'chatbot': lazy(() => import('./templates/Chatbot_Portfolio')),
  'glassmorphism': lazy(() => import('./templates/Glassmorphism/index.jsx')),
  'transparent-desktop-overlay-os': lazy(() => import('./templates/Transparent_Desktop_Overlay_OS/index.jsx')),
  'commercial-pilot-cockpit': lazy(() => import('./templates/Commercial_Pilot_Cockpit/index.jsx')),
  'book-page-flip-3d-render': lazy(() => import('./templates/Book_Page_Flip_3D_Render/index.jsx')),
  'ikea-assembly-manual': lazy(() => import('./templates/IKEA_Assembly_Manual/index.jsx')),
  'michelin-star-chef-plating': lazy(() => import('./templates/Michelin_Star_Chef_Plating/index.jsx')),
  'sommelier-wine-cellar-racks': lazy(() => import('./templates/Sommelier_Wine_Cellar_Racks/index.jsx')),
  'minimal-dark-fluid': lazy(() => import('./templates/Minimal_Dark_Fluid/index.jsx')),
  'terminal-skills': lazy(() => import('./templates/Terminal_Skills/index.jsx')),
  'chiragchrg-theme': lazy(() => import('./templates/ChiragChrg_Theme/index.jsx')),
  'film-director-clapperboard': lazy(() => import('./templates/Film_Director_Clapperboard/index.jsx')),
  'vercel-deploy': lazy(() => import('./templates/Vercel_Deploy/index')),
  'inspired-dev-jadiya': lazy(() => import('./templates/Inspired_Dev_Jadiya'))
};

export default function TemplateRegistry() {
  const { templateId } = useParams();
  const TemplateComponent = templates[templateId];

  if (!TemplateComponent) {
    return <div className="p-8 text-center text-red-500 font-bold text-2xl mt-20">Template "{templateId}" not found!</div>;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Loading Template...</p>
        </div>
      </div>
    }>
      <TemplateComponent />
    </Suspense>
  );
}
