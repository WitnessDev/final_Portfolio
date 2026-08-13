import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ContactSection } from './components/ContactSection';
import { ShowreelModal } from './components/ShowreelModal';
import { LightboxModal } from './components/LightboxModal';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PortfolioItem } from './types';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'public' | 'admin'>('public');
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeSection, setActiveSection] = useState('home');
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [activeLightboxItem, setActiveLightboxItem] = useState<any | null>(null);
  const [preselectedService, setPreselectedService] = useState<string>('');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [lang, setLang] = useState<'en' | 'sw'>('en');

  // Web Audio synth ref for optional subtle ambient hum
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const targetAdminUid = import.meta.env.VITE_ADMIN_UID;
        if (targetAdminUid && user.uid !== targetAdminUid) {
          // Immediately deny access and redirect to homepage if UID does not match VITE_ADMIN_UID
          auth.signOut();
          setAdminUser(null);
          setCurrentRoute('public');
          if (window.location.pathname.startsWith('/admin')) {
            window.history.pushState({}, '', '/');
          }
        } else if (!targetAdminUid && user.email?.toLowerCase() !== 'honestygeorge35@gmail.com') {
          auth.signOut();
          setAdminUser(null);
          setCurrentRoute('public');
        } else {
          setAdminUser(user);
        }
      } else {
        setAdminUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to URL path and hash changes for routing
  useEffect(() => {
    const checkRoute = () => {
      const isPathAdmin = window.location.pathname.startsWith('/admin') || window.location.pathname === '/admin';
      const isHashAdmin = window.location.hash === '#admin' || window.location.hash.startsWith('#admin');
      if (isPathAdmin || isHashAdmin) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('public');
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  // Intersection Observer for scroll spy on public website
  useEffect(() => {
    if (currentRoute !== 'public') return;
    const sections = ['home', 'about', 'services', 'portfolio', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentRoute]);

  const toggleAudioAtmosphere = () => {
    if (!audioEnabled) {
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        audioCtxRef.current = ctx;
        oscRef.current = osc;
        gainRef.current = gain;
        setAudioEnabled(true);
      } catch (err) {
        console.log("Audio Context not supported or blocked");
      }
    } else {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      setAudioEnabled(false);
    }
  };

  const handleSelectServiceForInquiry = (serviceId: string) => {
    setPreselectedService(serviceId);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateTo = (route: 'public' | 'admin') => {
    setCurrentRoute(route);
    if (route === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Auth loading state spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0E] text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#EED98A] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          Initializing Honesty Visuals...
        </p>
      </div>
    );
  }

  const targetAdminUid = import.meta.env.VITE_ADMIN_UID;
  const isAuthorized = Boolean(
    adminUser &&
    (!targetAdminUid || adminUser.uid === targetAdminUid || adminUser.email?.toLowerCase() === 'honestygeorge35@gmail.com')
  );

  const handleAdminSignOut = async () => {
    await auth.signOut();
    setAdminUser(null);
    navigateTo('public');
  };

  // PROTECTED ADMIN ROUTE
  if (currentRoute === 'admin') {
    if (isAuthorized && adminUser) {
      return (
        <AdminDashboard
          user={adminUser}
          onSignOut={handleAdminSignOut}
          onViewPublic={() => navigateTo('public')}
        />
      );
    }
    return (
      <AdminLogin
        onLoginSuccess={() => setCurrentRoute('admin')}
        onBackToPublic={() => navigateTo('public')}
      />
    );
  }

  // PUBLIC WEBSITE
  return (
    <div className="min-h-screen bg-[#0D0D0E] text-[#F9F8F6] font-body antialiased relative selection:bg-[#EED98A] selection:text-[#0D0D0E] overflow-x-hidden w-full">
      {/* Fixed Sticky Header */}
      <Navbar
        activeSection={activeSection}
        onOpenShowreel={() => setShowreelOpen(true)}
        lang={lang}
        onLanguageChange={setLang}
      />

      {/* Main Single Page Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          onOpenShowreel={() => setShowreelOpen(true)}
          lang={lang}
          onLanguageChange={setLang}
        />

        {/* About Section */}
        <AboutSection />

        {/* Services Section */}
        <ServicesSection
          onSelectServiceForInquiry={handleSelectServiceForInquiry}
          lang={lang}
        />

        {/* Portfolio Section */}
        <PortfolioSection onOpenItem={(item) => setActiveLightboxItem(item)} />

        {/* Contact Section */}
        <ContactSection preselectedServiceId={preselectedService} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ShowreelModal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
      />

      <LightboxModal
        item={activeLightboxItem}
        onClose={() => setActiveLightboxItem(null)}
        onInquire={(category) => handleSelectServiceForInquiry(category)}
      />
    </div>
  );
}
