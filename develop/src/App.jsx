import { Routes, Route } from 'react-router-dom';
import { Nav } from './components/Nav.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import { AmbientAudio } from './components/AmbientAudio.jsx';
import { RouteTransition } from './components/RouteTransition.jsx';
import { ScrollProgress } from './components/ScrollProgress.jsx';
import { ModeToggle } from './components/ModeToggle.jsx';
import { Mode3D } from './components/Mode3D.jsx';
import { StoryButton } from './components/StoryButton.jsx';
import { StoryMode } from './components/StoryMode.jsx';
import { WorldButton } from './components/WorldButton.jsx';
import { WorldMode } from './components/WorldMode.jsx';
import { LightboxProvider } from './components/LightboxProvider.jsx';
import { useThemeShortcut } from './useThemeShortcut.js';
import { useLenis } from './useLenis.js';
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  useLenis();
  useThemeShortcut();
  return (
    <LightboxProvider>
      <ScrollProgress />
      <div className="app-root">
        <Nav />
        <RouteTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RouteTransition>
      </div>
      {/* Siblings of .app-root so `position: fixed` isn't trapped by the
          page-in animation's filter/transform on .app-root. Ambient sits
          opposite the theme switch so they bookend the viewport corners. */}
      <div className="floating-toolbar floating-toolbar--left">
        <AmbientAudio />
      </div>
      <div className="floating-toolbar floating-toolbar--center">
        {/* ProjectToc portals its trigger into the slot so it sits inline,
            mid-row, among the controls; the slot collapses on non-project
            pages (leaving studio / story / world). */}
        <ModeToggle />
        <StoryButton />
        <div id="toc-slot" className="ft-toc-slot" />
        <WorldButton />
      </div>
      <div className="floating-toolbar floating-toolbar--right">
        <ThemeToggle />
      </div>
      <Mode3D />
      <StoryMode />
      <WorldMode />
    </LightboxProvider>
  );
}
