import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function App() {
  const [history, setHistory] = useState([])
  const [latestData, setLatestData] = useState(null)

  const fetchSpaceWeather = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/space-weather')
      const result = await response.json()

      if (result.data && result.data.length > 0) {
        setLatestData(result.data[0])
        const chartData = [...result.data].reverse().map(item => ({
          time: new Date(item.timestamp).toLocaleTimeString(),
          windSpeed: item.metrics.solar_wind_speed_km_s,
          risk: item.metrics.flare_risk_probability,
          status: item.metrics.status
        }))
        setHistory(chartData)
      }
    } catch (error) {
      console.error('Error al obtener datos del clima espacial:', error)
    }
  }

  useEffect(() => {
    fetchSpaceWeather()
    const interval = setInterval(fetchSpaceWeather, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    if (status === 'ALERTA_CRITICA') return '#dc3545'
    if (status === 'ADVERTENCIA') return '#ffc107'
    return '#28a745'
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#0b0e14', color: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ color: '#61dafb', lineHeight: '1.4' }}>Space Weather & Heliophysics Dashboard</h1>
        <p>Monitoreo de Viento Solar y Riesgo de Llamaradas (NASA/IBM Surya Model)</p>
      </header>

      {latestData && (
        <div style={{
          backgroundColor: '#1a1d24',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          borderLeft: `5px solid ${getStatusColor(latestData.metrics.status)}`
        }}>
          <h2>Estado en Tiempo Real</h2>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
            <div>
              <p style={{ margin: 0, color: '#888' }}>Velocidad del Viento</p>
              <h3 style={{ margin: 0, fontSize: '2rem' }}>{latestData.metrics.solar_wind_speed_km_s} km/s</h3>
            </div>
            <div>
              <p style={{ margin: 0, color: '#888' }}>Probabilidad de Impacto</p>
              <h3 style={{ margin: 0, fontSize: '2rem' }}>{latestData.metrics.flare_risk_probability}%</h3>
            </div>
            <div>
              <p style={{ margin: 0, color: '#888' }}>Nivel de Amenaza</p>
              <h3 style={{ margin: 0, fontSize: '2rem', color: getStatusColor(latestData.metrics.status) }}>
                {latestData.metrics.status.replace('_', ' ')}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: '#1a1d24', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Velocidad del Viento Solar (km/s)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis domain={['auto', 'auto']} stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                <Line type="monotone" dataKey="windSpeed" stroke="#8884d8" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ backgroundColor: '#1a1d24', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Riesgo de Llamarada Solar (%)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis domain={[0, 100]} stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                <Line type="monotone" dataKey="risk" stroke="#ff4d4f" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App