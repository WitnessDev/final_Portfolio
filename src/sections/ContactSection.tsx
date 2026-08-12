// Using automatic JSX runtime; no default React import required

export default function ContactSection(){
  return (
    <section className="p-6 bg-black/60">
      <div className="max-w-4xl mx-auto py-12">
        <h2 className="h-hero text-5xl">HAVE A STORY WORTH TELLING?</h2>
        <p className="mt-4 text-gray-300">LET'S CREATE.</p>

        <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Name" className="p-3 bg-white/5 rounded" />
          <input placeholder="Email" className="p-3 bg-white/5 rounded" />
          <input placeholder="Phone" className="p-3 bg-white/5 rounded" />
          <select className="p-3 bg-white/5 rounded">
            <option>Project type</option>
            <option>Photography</option>
            <option>Video</option>
          </select>
          <textarea placeholder="Message" className="p-3 bg-white/5 rounded md:col-span-2" />
          <div className="md:col-span-2 flex items-center justify-between">
            <button className="px-6 py-3 bg-white text-black rounded">Submit</button>
            <div className="text-gray-400">Email · Phone · Location · WhatsApp</div>
          </div>
        </form>
      </div>
    </section>
  )
}
