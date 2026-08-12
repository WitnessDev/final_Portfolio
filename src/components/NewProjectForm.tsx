import {useState} from 'react'
import { initializeApp } from 'firebase/app'
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { resizeImage } from '../utils/imageUtils'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import firebaseConfig from '../utils/firebaseConfig'

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const db = getFirestore(app)

export default function NewProjectForm({onCreated}:{onCreated?:()=>void}){
  const [title,setTitle] = useState('')
  const [desc,setDesc] = useState('')
  const [year,setYear] = useState<number | ''>('')
  const [file,setFile] = useState<File | null>(null)
  const [progress,setProgress] = useState(0)

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault()
    let coverUrl = ''
    if(file){
      const id = `${Date.now()}-${file.name}`
      const sRef = storageRef(storage, `projects/${id}.webp`)
      const blob = await resizeImage(file, 2048, 0.85)
      const task = uploadBytesResumable(sRef, blob)
      await new Promise<void>((res,rej)=>{
        task.on('state_changed', snap=>{
          setProgress(Math.round((snap.bytesTransferred/snap.totalBytes)*100))
        }, rej, async ()=>{
          coverUrl = await getDownloadURL(task.snapshot.ref)
          res()
        })
      })
    }

    await addDoc(collection(db,'projects'),{
      title, desc, year: year || null, cover: coverUrl, createdAt: serverTimestamp(), pos: Date.now()
    })
    setTitle(''); setDesc(''); setYear(''); setFile(null)
    if(onCreated) onCreated()
  }

  return (
    <form onSubmit={submit} className="p-4 bg-white/5 rounded space-y-3">
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-2 bg-black/20" />
      <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} className="w-full p-2 bg-black/20" />
      <input placeholder="Year" value={year as any} onChange={e=>setYear(Number(e.target.value)||'')} className="p-2 bg-black/20" />
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 bg-white text-black">Create Project</button>
        <div className="text-sm text-gray-400">{progress}%</div>
      </div>
    </form>
  )
}
