import { useState } from 'react'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [modelInfo, setModelInfo] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setResults([])

    try {
      const response = await fetch('http://localhost:3002/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: query })
      })
      const data = await response.json()

      if (data.status === 'success') {
        setResults(data.results)
        setModelInfo(data.model_used)
      }
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#333' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
        <h1 style={{ color: '#0056b3', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Earth Science NLP</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Búsqueda Semántica de Documentos Científicos de la NASA</p>
      </header>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: Análisis de derretimiento de glaciares en los Andes..."
          style={{ flex: 1, padding: '15px', fontSize: '1.2rem', borderRadius: '30px', border: '1px solid #ccc', outline: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '0 30px', fontSize: '1.1rem', borderRadius: '30px', border: 'none', backgroundColor: loading ? '#ccc' : '#0056b3', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: 'background 0.3s' }}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {modelInfo && !loading && (
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#888', marginBottom: '2rem' }}>
          Motor de inferencia utilizado: <strong>{modelInfo}</strong>
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {results.map((item, index) => (
          <div key={item.document.id} style={{ border: '1px solid #eaeaea', borderRadius: '10px', padding: '1.5rem', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#1a1a1a' }}>{item.document.title}</h2>
              <span style={{ backgroundColor: '#e9ecef', color: '#495057', padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Similitud: {(item.similarity_score * 100).toFixed(1)}%
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#555' }}>
              <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '5px' }}>
                ID: {item.document.id}
              </span>
              <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '5px' }}>
                Dominio: {item.document.domain}
              </span>
              <span style={{ backgroundColor: '#fef08a', color: '#854d0e', padding: '3px 8px', borderRadius: '5px' }}>
                Año: {item.document.year}
              </span>
            </div>
          </div>
        ))}

        {results.length === 0 && !loading && query && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>No se encontraron resultados para tu búsqueda.</p>
        )}
      </div>
    </div>
  )
}

export default App