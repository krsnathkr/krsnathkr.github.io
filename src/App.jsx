import React, { useState, useEffect } from 'react';
import { useWebHaptics } from 'web-haptics/react';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Education from './components/Education';
import Achievements from './components/Achievements';
import Research from './components/Research';
import Projects from './components/Projects';
import TechStack from './components/TechStack';
import Interests from './components/Interests';
import PhotoGallery from './components/PhotoGallery';
import Footer from './components/Footer';
import Archive from './components/Archive';
import ClickSpark from './components/ClickSpark';
import Contact from './components/Contact';

function AppContent() {
  const [showArchive, setShowArchive] = useState(false);
  const { isDark } = useTheme();
  const { trigger } = useWebHaptics();

  useEffect(() => {
    const handlePointerDown = (e) => {
      // Find out if what we clicked was a link, button, or inside one
      const target = e.target.closest('a, button, [role="button"]');
      if (target) {
        trigger("nudge");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [trigger]);

  return (
    <ClickSpark sparkColor={isDark ? '#fff' : '#111'} sparkSize={10} sparkRadius={20} sparkCount={8} duration={400}>
      <div className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 antialiased selection:bg-gray-900 selection:text-white dark:selection:bg-white dark:selection:text-gray-900 min-h-screen transition-colors duration-0">
        <ThemeToggle />
        <div className="max-w-2xl mx-auto px-6 py-20 md:py-28">

          {/* Main Home View */}
          <div id="home-view" className={`${showArchive ? 'hidden' : 'block'}`}>
            <Hero />

            <div className="content-scaled">
              <div className="border-b border-gray-100 dark:border-gray-800 mb-20" />

              <Experience />

              <Research />

              <Projects onArchiveClick={() => {
                setShowArchive(true);
                window.scrollTo(0, 0);
              }} />

              <Education />

              <TechStack />

              <Achievements />

              <PhotoGallery />

              <Interests />

              <Contact />

              <Footer />
            </div>
          </div>

          {/* Archive View */}
          {showArchive && (
            <div id="archive-view">
              <Archive onBack={() => {
                setShowArchive(false);
                window.scrollTo(0, 0);
              }} />
            </div>
          )}

        </div>
      </div>
    </ClickSpark>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
