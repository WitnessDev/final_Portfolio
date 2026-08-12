import {useState} from 'react'
import Lightbox from '../ui/Lightbox'

const PHOTOS = new Array(12).fill(0).map((_,i)=>({
  src:`/images/photo-${i+1}.jpg`,
  caption:`Caption for photo ${i+1}`,
  category: ['PORTRAITS','EVENTS','LIFESTYLE','DOCUMENTARY','COMMERCIAL','STREET','AERIAL'][i%7]
}))

export default function Visuals(){
  const [index,setIndex] = useState<number | null>(null)
  const open = (i:number)=>setIndex(i)
  const close = ()=>setIndex(null)

  return (
    <div className="p-6">
      <h1 className="h-hero text-6xl mb-6">VISUALS</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PHOTOS.map((p,i)=> (
          <button key={p.src} onClick={()=>open(i)} className="group overflow-hidden">
            <img src={p.src} alt={p.caption} className="w-full h-48 object-cover transform group-hover:scale-105 transition" />
            <div className="mt-2 label-mono text-gray-400">{String(i+1).padStart(2,'0')} / {PHOTOS.length} {p.category}</div>
          </button>
        ))}
      </div>

      {index!==null && <Lightbox items={PHOTOS} startIndex={index} onClose={close} />}
    </div>
  )
}
