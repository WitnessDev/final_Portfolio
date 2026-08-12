// Using automatic JSX runtime; no default React import required

const PROJECTS = new Array(6).fill(0).map((_,i)=>({
  id:i+1,
  thumb:`/videos/thumb-${i+1}.jpg`,
  title:`Project ${i+1}`,
  desc:`Short description for project ${i+1}`,
  category: 'DOCUMENTARY',
  year: 2026,
  url:`https://example.com/video${i+1}`
}))

export default function VideoGrid(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PROJECTS.map(p=> (
        <div key={p.id} className="relative group rounded overflow-hidden">
          <img src={p.thumb} alt={p.title} className="w-full h-64 object-cover transform group-hover:scale-105 transition" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur">
              <div className="w-10 h-10 border-2 border-white/80 rounded-full flex items-center justify-center animate-pulse">▶</div>
            </div>
          </div>
          <div className="p-4 bg-black/50">
            <h3 className="h-hero text-xl">{p.title}</h3>
            <p className="text-gray-300">{p.desc}</p>
            <div className="mt-2 label-mono text-gray-400">{p.category} · {p.year}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
