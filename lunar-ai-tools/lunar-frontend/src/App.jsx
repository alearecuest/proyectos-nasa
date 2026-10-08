import { useState, useRef } from 'react'

function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:3000/analyze-lunar-image', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (data && data.data && data.data.bounding_boxes) {
        setResult(data.data)
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        ctx.strokeStyle = '#ff0000'
        ctx.lineWidth = 4

        data.data.bounding_boxes.forEach(box => {
          const [x1, y1, x2, y2] = box
          const width = x2 - x1
          const height = y2 - y1

          ctx.strokeRect(x1, y1, width, height)

          ctx.fillStyle = '#ff0000'
          ctx.font = '24px Arial'
          ctx.fillText('Cráter', x1, y1 - 10)
        })
      }
    } catch (error) {
      console.error('Error al analizar la imagen:', error)
      alert("Error comunicándose con la API")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
        <h1>🌕 Lunar AI Crater Detector</h1>
        <p>NASA-IBM Lunar Foundation Model - Inferencia en tiempo real</p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Subir Imagen Lunar
          </button>
        </div>

        {loading && <p style={{ color: '#0056b3', fontWeight: 'bold' }}>Procesando imagen con la red neuronal (esperá ~1.5s)...</p>}

        {result && (
          <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '5px' }}>
            <p><strong>Estado:</strong> {result.mock_mode ? 'Simulación (Mock)' : 'Modelo Real'}</p>
            <p><strong>Cráteres Detectados:</strong> {result.craters_detected}</p>
            <p><strong>Tamaño de imagen analizada:</strong> {result.image_size}</p>
          </div>
        )}

        <div style={{ marginTop: '1rem', border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden', display: 'inline-block' }}>
          {/* El canvas se ajusta visualmente al 100% de su contenedor para que no se desborde la pantalla, pero internamente mantiene la resolución original */}
          <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', display: 'block' }}></canvas>
        </div>
      </main>
    </div>
  )
}

export default App