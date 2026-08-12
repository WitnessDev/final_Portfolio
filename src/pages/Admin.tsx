import {useState, useEffect, lazy, Suspense} from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'

// Firebase config is read from environment variables
import firebaseConfig from '../utils/firebaseConfig'
import { PhotosList, ProjectsList, VideosList, SongsList } from '../components/AdminLists'
const UploaderPlaceholder = lazy(()=> import('../components/PhotoUploader'))
const NewProjectPlaceholder = lazy(()=> import('../components/NewProjectForm'))
const VideoUploaderPlaceholder = lazy(()=> import('../components/VideoUploader'))
const MusicManagerPlaceholder = lazy(()=> import('../components/MusicManager'))

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default function Admin(){
  const [user,setUser] = useState<any>(null)
  const [tab,setTab] = useState<'photos'|'projects'|'videos'|'songs'>('photos')
  const [email,setEmail] = useState('')
  const [pass,setPass] = useState('')

  useEffect(()=>onAuthStateChanged(auth, u=>setUser(u)),[])

  const login = async ()=>{
    try{ await signInWithEmailAndPassword(auth,email,pass) }
    catch(e){ alert('Login failed') }
  }
  const logout = ()=> signOut(auth)

  if(!user) return (
    <div className="p-6 max-w-md">
      <h2 className="text-2xl">HONESTY STUDIO</h2>
      <p className="mt-4">Good morning, HONESTY.</p>
      <input className="w-full p-3 mt-4" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full p-3 mt-2" placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
      <div className="flex gap-2 mt-4">
        <button onClick={login} className="px-4 py-2 bg-white text-black">Sign in</button>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">HONESTY STUDIO</h2>
          <div className="text-gray-400">24 Photos · 8 Projects · 4 Videos · 6 Songs</div>
        </div>
        <div>
          <button onClick={logout} className="px-4 py-2 bg-white text-black">Sign out</button>
        </div>
      </div>

      <section className="mt-6">
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-black">+ NEW PROJECT</button>
          <button className="px-4 py-2 bg-white text-black">+ ADD VIDEO</button>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4">Recent upload preview</div>
          <div className="bg-white/5 p-4">Recent upload preview</div>
          <div className="bg-white/5 p-4">Recent upload preview</div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg mb-3">Upload Photographs</h3>
          {/* PhotoUploader handles Storage + Firestore metadata */}
          <Suspense fallback={<div>Loading uploader...</div>}>
            <UploaderPlaceholder />
          </Suspense>

          <div className="mt-6">
            <h4 className="mb-2">Create Project</h4>
            <Suspense fallback={<div>Loading form...</div>}>
              <NewProjectPlaceholder />
            </Suspense>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="mb-2">Add Video</h4>
              <Suspense fallback={<div>Loading video uploader...</div>}>
                <VideoUploaderPlaceholder />
              </Suspense>
            </div>

            <div>
              <h4 className="mb-2">Add Music</h4>
              <Suspense fallback={<div>Loading music manager...</div>}>
                <MusicManagerPlaceholder />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg mb-3">Manage Content</h3>
          <div className="flex gap-2 mb-4">
            <button onClick={()=>setTab('photos')} className="px-3 py-1 bg-white/5">Photos</button>
            <button onClick={()=>setTab('projects')} className="px-3 py-1 bg-white/5">Projects</button>
            <button onClick={()=>setTab('videos')} className="px-3 py-1 bg-white/5">Videos</button>
            <button onClick={()=>setTab('songs')} className="px-3 py-1 bg-white/5">Music</button>
          </div>
          <div>
            {tab==='photos' && <PhotosList />}
            {tab==='projects' && <ProjectsList />}
            {tab==='videos' && <VideosList />}
            {tab==='songs' && <SongsList />}
          </div>
        </div>
      </section>

    </div>
  )
}
