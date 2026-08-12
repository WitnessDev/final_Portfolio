import {useState, useRef} from 'react'
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { resizeImage } from '../utils/imageUtils'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../utils/firebaseConfig'

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const db = getFirestore(app)

export default function PhotoUploader(){
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [progress, setProgress] = useState<Record<string, number>>({})
  const inputRef = useRef<HTMLInputElement|null>(null)

  const onFiles = (selected: FileList | null)=>{
    if(!selected) return
    const arr = Array.from(selected)
    setFiles(arr)
    setPreviews(arr.map(f=>URL.createObjectURL(f)))
  }

  const uploadAll = async ()=>{
    for(const file of files){
      const id = `${Date.now()}-${file.name}`
      const sRef = storageRef(storage, `photos/${id}.webp`)
      // resize and convert to webp
      const blob = await resizeImage(file, 2048, 0.85)
      const task = uploadBytesResumable(sRef, blob)
      task.on('state_changed', (snap)=>{
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
        setProgress(p=>({...p, [file.name]: pct}))
      }, (err)=>{
        console.error('Upload error', err)
      }, async ()=>{
        const url = await getDownloadURL(task.snapshot.ref)
        // Save metadata to Firestore
        await addDoc(collection(db, 'photos'), {
          name: file.name,
          url,
          createdAt: serverTimestamp(),
          pos: Date.now(),
          published: false
        })
      })
    }
  }

  return (
    <div className="p-4 bg-white/5 rounded">
      <div className="mb-2">Upload photographs (drag & drop or select)</div>
      <input ref={inputRef} type="file" multiple accept="image/*" onChange={e=>onFiles(e.target.files)} />
      <div className="mt-4 grid grid-cols-3 gap-2">
        {previews.map((p,i)=> (
          <div key={p} className="bg-black/30 rounded overflow-hidden reveal in">
            <img src={p} alt="preview" className="w-full h-32 object-cover img-zoom" />
            <div className="p-2 text-sm">{files[i].name}</div>
            <div className="p-2 label-mono text-gray-400">{progress[files[i].name] ?? 0}%</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-white text-black" onClick={uploadAll}>Start Upload</button>
        <button className="px-4 py-2 border" onClick={()=>{ setFiles([]); setPreviews([]); setProgress({}) }}>Clear</button>
      </div>
    </div>
  )
}
