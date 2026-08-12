// Using automatic JSX runtime; no default React import required

const LINKS = [
  {label:'Instagram', url:'#'},
  {label:'YouTube', url:'#'},
  {label:'Facebook', url:'#'},
  {label:'TikTok', url:'#'},
  {label:'WhatsApp', url:'#'},
]

export default function SocialSection(){
  return (
    <section className="p-6">
      <h3 className="h-hero text-3xl mb-4">FOLLOW THE JOURNEY</h3>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {LINKS.map(l=> (
          <a key={l.label} href={l.url} className="block bg-white/5 rounded p-4 text-center">{l.label}</a>
        ))}
      </div>
    </section>
  )
}
