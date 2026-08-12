import {useState} from 'react'
import { initializeApp } from 'firebase/app'
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import firebaseConfig from '../utils/firebaseConfig'

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const db = getFirestore(app)

export default function VideoUploader(){
  const [title,setTitle] = useState('')
  const [desc,setDesc] = useState('')
  const [category,setCategory] = useState('DOCUMENTARY')
  const [year,setYear] = useState<number | ''>('')
  const [thumbFile,setThumbFile] = useState<File | null>(null)
  const [videoUrl,setVideoUrl] = useState('')
  const [progress,setProgress] = useState(0)

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault()
    let thumbUrl = ''
    if(thumbFile){
      const id = `${Date.now()}-${thumbFile.name}`
      const sRef = storageRef(storage, `video-thumbs/${id}`)
      const task = uploadBytesResumable(sRef, thumbFile)
      await new Promise<void>((res,rej)=>{
        task.on('state_changed', snap=> setProgress(Math.round((snap.bytesTransferred/snap.totalBytes)*100)), rej, async ()=>{ thumbUrl = await getDownloadURL(task.snapshot.ref); res() })
      })
    }

    await addDoc(collection(db,'videos'),{
      title, desc, category, year: year || null, thumb: thumbUrl, url: videoUrl, createdAt: serverTimestamp()
    })

    setTitle(''); setDesc(''); setCategory('DOCUMENTARY'); setYear(''); setThumbFile(null); setVideoUrl(''); setProgress(0)
  }

  return (
    <form onSubmit={submit} className="p-4 bg-white/5 rounded space-y-3">
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-2 bg-black/20" />
      <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} className="w-full p-2 bg-black/20" />
      <input placeholder="Year" value={year as any} onChange={e=>setYear(Number(e.target.value)||'')} className="p-2 bg-black/20" />
      <input placeholder="Video URL" value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} className="w-full p-2 bg-black/20" />
      <input type="file" accept="image/*" onChange={e=>setThumbFile(e.target.files?.[0]||null)} />
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 bg-white text-black">Add Video</button>
        <div className="text-sm text-gray-400">{progress}%</div>
      </div>
    </form>
  )
}
