// Using automatic JSX runtime; no default React import required
import VideoGrid from '../sections/VideoGrid'
import MusicSection from '../sections/MusicSection'
import ServicesSection from '../sections/ServicesSection'
import AboutSection from '../sections/AboutSection'
import SocialSection from '../sections/SocialSection'
import ContactSection from '../sections/ContactSection'

export default function Home(){
  return (
    <div className="space-y-24 p-6">
      <header className="flex items-center gap-6">
        <div className="w-2/3">
          <h1 className="h-hero text-6xl md:text-8xl leading-tight">I DON'T JUST
          CAPTURE MOMENTS. I PRESERVE STORIES.</h1>
          <p className="mt-6 max-w-prose text-gray-300">HONESTY — Visual storyteller, worship minister, musician.</p>
        </div>
        <div className="w-1/3">
          <img src="/placeholder-hero.jpg" alt="hero" className="w-full h-64 object-cover rounded" />
        </div>
      </header>

      <section>
        <h2 className="h-hero text-4xl mb-6">MOVING STORIES</h2>
        <VideoGrid />
      </section>

      <section>
        <h2 className="h-hero text-4xl mb-6">MUSIC</h2>
        <MusicSection />
      </section>

      <ServicesSection />
      <AboutSection />
      <section>
        <h2 className="h-hero text-4xl mb-6">PURPOSE OVER EVERYTHING</h2>
        <p className="text-gray-300 max-w-prose">A short statement about faith, purpose and creativity. Editable via Admin.</p>
      </section>

      <SocialSection />

      <ContactSection />
    </div>
  )
}
