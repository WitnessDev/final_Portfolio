import {useState} from 'react'
import { initializeApp } from 'firebase/app'
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import firebaseConfig from '../utils/firebaseConfig'

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const db = getFirestore(app)

export default function MusicManager(){
  const [title,setTitle] = useState('')
  const [artist,setArtist] = useState('')
  const [cover,setCover] = useState<File | null>(null)
  const [audioUrl,setAudioUrl] = useState('')
  const [spotify,setSpotify] = useState('')
  const [apple,setApple] = useState('')
  const [progress,setProgress] = useState(0)

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault()
    let coverUrl = ''
    if(cover){
      const id = `${Date.now()}-${cover.name}`
      const sRef = storageRef(storage, `music-covers/${id}`)
      const task = uploadBytesResumable(sRef, cover)
      await new Promise<void>((res,rej)=>{
        task.on('state_changed', snap=> setProgress(Math.round((snap.bytesTransferred/snap.totalBytes)*100)), rej, async ()=>{ coverUrl = await getDownloadURL(task.snapshot.ref); res() })
      })
    }

    await addDoc(collection(db,'songs'),{
      title, artist, cover: coverUrl, audioUrl, spotify, apple, createdAt: serverTimestamp()
    })

    setTitle(''); setArtist(''); setCover(null); setAudioUrl(''); setSpotify(''); setApple(''); setProgress(0)
  }

  return (
    <form onSubmit={submit} className="p-4 bg-white/5 rounded space-y-3">
      <input placeholder="Song title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-2 bg-black/20" />
      <input placeholder="Featured artist" value={artist} onChange={e=>setArtist(e.target.value)} className="w-full p-2 bg-black/20" />
      <input type="file" accept="image/*" onChange={e=>setCover(e.target.files?.[0]||null)} />
      <input placeholder="Audio URL" value={audioUrl} onChange={e=>setAudioUrl(e.target.value)} className="w-full p-2 bg-black/20" />
      <input placeholder="Spotify URL" value={spotify} onChange={e=>setSpotify(e.target.value)} className="w-full p-2 bg-black/20" />
      <input placeholder="Apple Music URL" value={apple} onChange={e=>setApple(e.target.value)} className="w-full p-2 bg-black/20" />
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 bg-white text-black">Add Song</button>
        <div className="text-sm text-gray-400">{progress}%</div>
      </div>
    </form>
  )
}
