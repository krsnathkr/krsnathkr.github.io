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
import ExperienceArchive from './components/ExperienceArchive';
import ClickSpark from './components/ClickSpark';
import Contact from './components/Contact';
import Ticker from './components/Ticker';
import SideNav from './components/SideNav';
import { shouldDebugHaptics } from './utils/haptics';

const HAPTIC_TARGET_SELECTOR = [
  'a',
  'button',
  '[role="button"]',
  '[data-haptic]',
  'summary',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  '[tabindex]:not([tabindex="-1"])',
  '[class*="cursor-pointer"]',
].join(', ');

const isDisabledInteraction = (element) => {
  return Boolean(
    element.closest('[disabled], [aria-disabled="true"], [data-haptic="off"]')
  );
};

function AppContent() {
  const [showArchive, setShowArchive] = useState(false);
  const [showExperienceArchive, setShowExperienceArchive] = useState(false);
  const { isDark } = useTheme();
  const { trigger } = useWebHaptics({
    debug: shouldDebugHaptics(),
  });

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.isTrusted) return;
      if (e.defaultPrevented || !(e.target instanceof Element)) return;

      const target = e.target.closest(HAPTIC_TARGET_SELECTOR);
      if (!target || isDisabledInteraction(target)) return;

      const pattern = target.dataset.haptic || 'nudge';
      const haptic = trigger(pattern);
      if (haptic?.catch) {
        haptic.catch(() => {});
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [trigger]);

  return (
    <ClickSpark sparkColor={isDark ? '#fff' : '#111'} sparkSize={10} sparkRadius={20} sparkCount={8} duration={400}>
      <div className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 antialiased selection:bg-gray-900 selection:text-white dark:selection:bg-white dark:selection:text-gray-900 min-h-screen transition-colors duration-0">
        <Ticker />
        <ThemeToggle />
        <SideNav visible={!showArchive && !showExperienceArchive} />
        <div className="max-w-2xl mx-auto px-6 py-20 md:py-28">

          {/* Main Home View */}
          <div id="home-view" className={`${showArchive || showExperienceArchive ? 'hidden' : 'block'}`}>
            <Hero />

            <div className="content-scaled">
              <div className="border-b border-gray-100 dark:border-gray-800 mb-20" />

              <Experience onFullResumeClick={() => {
                setShowExperienceArchive(true);
                window.scrollTo(0, 0);
              }} />

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

          {/* Experience Archive View */}
          {showExperienceArchive && (
            <div id="experience-archive-view">
              <ExperienceArchive onBack={() => {
                setShowExperienceArchive(false);
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
