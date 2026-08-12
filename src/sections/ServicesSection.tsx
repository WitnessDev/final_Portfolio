// Using automatic JSX runtime; no default React import required

const SERVICES = [
  'PHOTOGRAPHY','VIDEOGRAPHY','GRAPHIC DESIGN','MEDIA DIRECTION','DRONE / AERIAL','MUSIC'
]

export default function ServicesSection(){
  return (
    <section className="p-6">
      <h2 className="h-hero text-4xl mb-6">WHAT I CREATED</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {SERVICES.map(s=> (
          <div key={s} className="relative group h-40 flex items-center justify-center text-2xl font-semibold">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition"></div>
            <div className="z-10 tracking-tight">{s}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
