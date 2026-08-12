export async function resizeImage(file: File, maxWidth = 2048, quality = 0.85): Promise<Blob> {
  const img = document.createElement('img')
  const dataUrl = await fileToDataURL(file)
  img.src = dataUrl

  await new Promise<void>((res)=> { img.onload = ()=> res() })

  const scale = Math.min(1, maxWidth / img.naturalWidth)
  const width = Math.round(img.naturalWidth * scale)
  const height = Math.round(img.naturalHeight * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)

  return await new Promise<Blob>((res)=> canvas.toBlob(b=> res(b!), 'image/webp', quality))
}

function fileToDataURL(file: File): Promise<string>{
  return new Promise((res, rej)=>{
    const reader = new FileReader()
    reader.onload = ()=> res(String(reader.result))
    reader.onerror = rej
    reader.readAsDataURL(file)
  })
}
