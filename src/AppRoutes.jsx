import { useState, lazy, Suspense } from 'react';
import GoldMotionSite from './GoldMotionSite.jsx';
import MinimalismSite from './MinimalismSite.jsx';
import StudioSite from './StudioSite.jsx';
import CareerDemo from './CareerDemo.jsx';
import App from './App.jsx';

const CharacterDemoPage = lazy(() => import('./avatar/demo/CharacterDemoPage.jsx'));
const CharacterLab = lazy(() => import('./avatar/character/CharacterLab.jsx'));
const TaraDemoPage = lazy(() => import('./avatar/tara/TaraDemoPage.jsx'));

export default function AppRoutes() {
  const searchParams = new URLSearchParams(window.location.search);
  const demo = searchParams.get('demo') || searchParams.get('site');
  
  // Default to gold motion site for this edition
  const [currentSite, setCurrentSite] = useState(() => {
    if (demo === 'minimalism') return 'minimalism';
    if (demo === 'studio') return 'studio';
    return 'gold';
  });

  if (demo === 'elena') return <Suspense fallback={null}><CharacterLab /></Suspense>;
  if (demo === 'tara') return <Suspense fallback={null}><TaraDemoPage /></Suspense>;
  if (demo === 'characters') return <Suspense fallback={null}><CharacterDemoPage /></Suspense>;
  if (demo === 'editorial') return <CareerDemo />;
  if (demo === 'original') return <App />;

  if (currentSite === 'minimalism') {
    return <MinimalismSite currentSite={currentSite} onSwitchSite={setCurrentSite} />;
  }

  if (currentSite === 'studio') {
    return <StudioSite currentSite={currentSite} onSwitchSite={setCurrentSite} />;
  }

  return <GoldMotionSite currentSite={currentSite} onSwitchSite={setCurrentSite} />;
}
