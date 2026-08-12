// Using automatic JSX runtime; no default React import required

export default function AboutSection(){
  return (
    <section className="p-6 flex gap-6 items-center">
      <div className="w-1/3">
        <img src="/about/portrait.jpg" alt="Honesty" className="w-full h-96 object-cover rounded" />
      </div>
      <div className="w-2/3">
        <h3 className="h-hero text-3xl">THE PERSON BEHIND THE LENS</h3>
        <p className="mt-4 text-gray-300 max-w-prose">Honesty is a visual storyteller whose work blends cinematic photography with heartfelt worship. This is a magazine-style profile — editable in Admin.</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="label-mono text-gray-400">Location</h4>
            <div>City, Country</div>
          </div>
          <div>
            <h4 className="label-mono text-gray-400">Experience</h4>
            <div>10+ years</div>
          </div>
        </div>
      </div>
    </section>
  )
}
