import { useEffect, useState, useRef } from 'react'
import { getFirestore, collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../utils/firebaseConfig'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

function useCollection(path:string){
  const [items,setItems] = useState<any[]>([])
  useEffect(()=>{
    const q = query(collection(db, path), orderBy('createdAt','desc'))
    return onSnapshot(q, snap=> setItems(snap.docs.map(d=>({id:d.id, ...d.data()}))))
  },[path])
  return items
}

export function PhotosList(){
  const [photos,setPhotos] = useState<any[]>([])
  const [sel,setSel] = useState<Record<string,boolean>>({})
  useEffect(()=>{
    const q = query(collection(db,'photos'), orderBy('pos','desc'))
    return onSnapshot(q, snap=> setPhotos(snap.docs.map(d=>({id:d.id, ...d.data()}))))
  },[])

  const remove = async (id:string)=> await deleteDoc(doc(db,'photos',id))
  const removeConfirm = async (id:string)=>{
    if(!confirm('Delete this photo? This action cannot be undone.')) return
    await deleteDoc(doc(db,'photos',id))
  }
  const toggle = async (id:string, val:boolean)=> await updateDoc(doc(db,'photos',id), {published: val})

  const bulkToggle = async (val:boolean)=>{
    const ids = Object.keys(sel).filter(k=>sel[k])
    if(ids.length===0) return
    await Promise.all(ids.map(id=> updateDoc(doc(db,'photos',id), {published: val})))
    setSel({})
  }

  const bulkDelete = async ()=>{
    const ids = Object.keys(sel).filter(k=>sel[k])
    if(ids.length===0) return
    if(!confirm(`Delete ${ids.length} selected photo(s)? This cannot be undone.`)) return
    await Promise.all(ids.map(id=> deleteDoc(doc(db,'photos',id))))
    setSel({})
  }

  // drag/drop reorder by swapping pos values
  const dragId = useRef<string | null>(null)

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <button className="px-3 py-1 border" onClick={()=>bulkToggle(true)}>Publish Selected</button>
        <button className="px-3 py-1 border" onClick={()=>bulkToggle(false)}>Unpublish Selected</button>
      </div>
      <div className="space-y-2">
        {photos.map(p=> (
          <div key={p.id}
            draggable
            onDragStart={(e)=>{ dragId.current = p.id }}
            onDragOver={(e)=> e.preventDefault() }
            onDrop={async (e)=>{
              e.preventDefault()
              const from = dragId.current
              const to = p.id
              if(!from || from === to) return
              const aSnap = photos.find(x=>x.id===from)
              const bSnap = photos.find(x=>x.id===to)
              if(!aSnap || !bSnap) return
              await updateDoc(doc(db,'photos',aSnap.id), { pos: bSnap.pos })
              await updateDoc(doc(db,'photos',bSnap.id), { pos: aSnap.pos })
            }}
            className="flex items-center justify-between bg-white/5 p-2 rounded">
            <div className="flex items-center gap-3">
              <img src={p.url} className="w-16 h-12 object-cover rounded" />
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="label-mono text-gray-400">{p.id}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={!!sel[p.id]} onChange={e=>setSel(s=>({...s, [p.id]: e.target.checked}))} />
              <button onClick={()=>toggle(p.id, !p.published)} className="px-3 py-1 border">{p.published? 'Unpublish' : 'Publish'}</button>
              <button onClick={()=>removeConfirm(p.id)} className="px-3 py-1 border">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


export function ProjectsList(){
  const [items,setItems] = useState<any[]>([])
  useEffect(()=>{
    const q = query(collection(db,'projects'), orderBy('pos','desc'))
    return onSnapshot(q, snap=> setItems(snap.docs.map(d=>({id:d.id, ...d.data()}))))
  },[])

  const remove = async (id:string)=>{
    if(!confirm('Delete this project? This action cannot be undone.')) return
    await deleteDoc(doc(db,'projects',id))
  }
  const toggle = async (id:string, val:boolean)=> await updateDoc(doc(db,'projects',id), {published: val})

  const move = async (index:number, dir:number)=>{
    const a = items[index]
    const b = items[index + dir]
    if(!a || !b) return
    const aRef = doc(db,'projects', a.id)
    const bRef = doc(db,'projects', b.id)
    await updateDoc(aRef, { pos: b.pos })
    await updateDoc(bRef, { pos: a.pos })
  }

  return (
    <div className="space-y-2">
      {items.map((p,i)=> (
        <div key={p.id} className="flex items-center justify-between bg-white/5 p-2 rounded">
          <div className="flex items-center gap-3">
            {p.cover && <img src={p.cover} className="w-20 h-12 object-cover rounded" />}
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="label-mono text-gray-400">{p.year || ''}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>move(i, -1)} className="px-3 py-1 border">↑</button>
            <button onClick={()=>move(i, +1)} className="px-3 py-1 border">↓</button>
            <button onClick={()=>toggle(p.id, !p.published)} className="px-3 py-1 border">{p.published? 'Unpublish' : 'Publish'}</button>
            <button onClick={()=>remove(p.id)} className="px-3 py-1 border">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function VideosList(){
  const items = useCollection('videos')
  const remove = async (id:string)=>{
    if(!confirm('Delete this video? This action cannot be undone.')) return
    await deleteDoc(doc(db,'videos',id))
  }
  return (
    <div className="space-y-2">
      {items.map(v=> (
        <div key={v.id} className="flex items-center justify-between bg-white/5 p-2 rounded">
          <div className="flex items-center gap-3">
            {v.thumb && <img src={v.thumb} className="w-20 h-12 object-cover rounded" />}
            <div>
              <div className="font-semibold">{v.title}</div>
              <div className="label-mono text-gray-400">{v.category} · {v.year}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <a href={v.url} target="_blank" rel="noreferrer" className="px-3 py-1 border">Open</a>
            <button onClick={()=>remove(v.id)} className="px-3 py-1 border">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SongsList(){
  const items = useCollection('songs')
  const remove = async (id:string)=>{
    if(!confirm('Delete this song? This action cannot be undone.')) return
    await deleteDoc(doc(db,'songs',id))
  }
  return (
    <div className="space-y-2">
      {items.map(s=> (
        <div key={s.id} className="flex items-center justify-between bg-white/5 p-2 rounded">
          <div className="flex items-center gap-3">
            {s.cover && <img src={s.cover} className="w-20 h-12 object-cover rounded" />}
            <div>
              <div className="font-semibold">{s.title}</div>
              <div className="label-mono text-gray-400">{s.artist}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <a href={s.audioUrl} target="_blank" rel="noreferrer" className="px-3 py-1 border">Play</a>
            <button onClick={()=>remove(s.id)} className="px-3 py-1 border">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
