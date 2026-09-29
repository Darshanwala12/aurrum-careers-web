import { lazy, Suspense } from 'react';
import App from './App.jsx';
import CareerDemo from './CareerDemo.jsx';
import GoldenSite from './GoldenSite.jsx';
import MinimalismSite from './MinimalismSite.jsx';
import StudioSite from './StudioSite.jsx';
import GoldMotionSite from './GoldMotionSite.jsx';

const CharacterDemoPage = lazy(() => import('./avatar/demo/CharacterDemoPage.jsx'));
const CharacterLab = lazy(() => import('./avatar/character/CharacterLab.jsx'));
const TaraDemoPage = lazy(() => import('./avatar/tara/TaraDemoPage.jsx'));

export default function AppRoutes() {
  const searchParams = new URLSearchParams(window.location.search);
  const demo = searchParams.get('demo') || searchParams.get('site');

  if (demo === 'elena') return <Suspense fallback={null}><CharacterLab /></Suspense>;
  if (demo === 'tara') return <Suspense fallback={null}><TaraDemoPage /></Suspense>;
  if (demo === 'characters') return <Suspense fallback={null}><CharacterDemoPage /></Suspense>;
  if (demo === 'editorial') return <CareerDemo />;
  if (demo === 'original') return <App />;
  if (demo === 'minimalism') return <MinimalismSite />;
  if (demo === 'studio') return <StudioSite />;
  if (demo === 'gold-motion') return <GoldMotionSite />;

  // Default: First design (GoldenSite)
  return <GoldenSite />;
}
