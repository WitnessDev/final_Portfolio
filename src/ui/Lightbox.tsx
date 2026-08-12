import {useEffect, useState, useRef} from 'react'

type Item = {src:string;caption?:string}

export default function Lightbox({items, startIndex=0, onClose}:{items:Item[];startIndex?:number;onClose:()=>void}){
  const [index,setIndex] = useState(startIndex)
  const containerRef = useRef<HTMLDivElement|null>(null)

  useEffect(()=>{
    const onKey = (e:KeyboardEvent)=>{
      if(e.key==='Escape') onClose()
      if(e.key==='ArrowRight') setIndex(i=>Math.min(i+1, items.length-1))
      if(e.key==='ArrowLeft') setIndex(i=>Math.max(i-1,0))
    }
    window.addEventListener('keydown', onKey)
    return ()=>window.removeEventListener('keydown', onKey)
  },[])

  // basic touch swipe
  useEffect(()=>{
    let startX:number|undefined
    const el = containerRef.current
    if(!el) return
    const onTouchStart = (e:TouchEvent)=> startX = e.touches[0].clientX
    const onTouchEnd = (e:TouchEvent)=>{
      if(startX===undefined) return
      const diff = e.changedTouches[0].clientX - startX
      if(diff>50) setIndex(i=>Math.max(i-1,0))
      if(diff<-50) setIndex(i=>Math.min(i+1, items.length-1))
      startX=undefined
    }
    el.addEventListener('touchstart', onTouchStart)
    el.addEventListener('touchend', onTouchEnd)
    return ()=>{
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  },[containerRef.current])

  const prev = ()=> setIndex(i=>Math.max(i-1,0))
  const next = ()=> setIndex(i=>Math.min(i+1, items.length-1))

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <button className="absolute top-6 right-6 text-white text-2xl" onClick={onClose}>×</button>
      <button className="absolute left-6 text-2xl" onClick={prev}>‹</button>
      <div className="max-w-5xl mx-6">
        <img src={items[index].src} alt="" className="w-full h-[70vh] object-contain" />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="label-mono text-gray-400">{String(index+1).padStart(2,'0')} / {items.length}</div>
            <div className="mt-1">{items[index].caption}</div>
          </div>
          <div className="text-gray-400">{items[index].src.endsWith('.mp4')? 'VIDEO / MEDIA' : 'PHOTO'}</div>
        </div>
      </div>
      <button className="absolute right-6 text-2xl" style={{bottom: '50%'}} onClick={next}>›</button>
    </div>
  )
}
