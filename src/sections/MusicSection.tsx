import {useRef, useState} from 'react'

export default function MusicSection(){
  const audioRef = useRef<HTMLAudioElement|null>(null)
  const [playing,setPlaying] = useState(false)

  const toggle = ()=>{
    if(!audioRef.current) return
    if(playing){ audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 items-center">
      <div>
        <img src="/music/cover.jpg" alt="cover" className="w-full h-80 object-cover rounded" />
      </div>
      <div>
        <div className="label-mono text-gray-400">AHSANTE!</div>
        <h3 className="h-hero text-3xl">feat. Paul Clement</h3>
        <p className="text-gray-300 mt-4">A worship song that reflects honesty's musical identity. Editable from Admin.</p>

        <div className="mt-6 flex items-center gap-4">
          <button onClick={toggle} className="px-6 py-3 bg-white text-black rounded">
            {playing? 'Pause' : 'Play'}
          </button>
          <div className="text-gray-400">Spotify · Apple Music · YouTube</div>
        </div>

        <audio ref={audioRef} src="/music/song.mp3" />
      </div>
    </div>
  )
}
