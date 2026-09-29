import { lazy, Suspense } from 'react';
import App from './App.jsx';
import CareerDemo from './CareerDemo.jsx';
import GoldenSite from './GoldenSite.jsx';
const CharacterDemoPage = lazy(() => import('./avatar/demo/CharacterDemoPage.jsx'));
const CharacterLab = lazy(() => import('./avatar/character/CharacterLab.jsx'));
const TaraDemoPage = lazy(() => import('./avatar/tara/TaraDemoPage.jsx'));
export default function AppRoutes() {
  const demo = new URLSearchParams(window.location.search).get('demo');
  if (demo === 'elena') return <Suspense fallback={null}><CharacterLab /></Suspense>;
  if (demo === 'tara') return <Suspense fallback={null}><TaraDemoPage /></Suspense>;
  if (demo === 'characters') return <Suspense fallback={null}><CharacterDemoPage /></Suspense>;
  if (demo === 'editorial') return <CareerDemo />;
  if (demo === 'original') return <App />;
  return <GoldenSite />;
}
