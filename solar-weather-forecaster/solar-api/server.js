const fastify = require('fastify')({ logger: true })
const axios = require('axios')
const cron = require('node-cron')

fastify.register(require('@fastify/cors'), { origin: '*' })

let weatherHistory = []

const fetchSolarForecast = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8001/forecast/solar-flare')
    const data = response.data

    weatherHistory.unshift(data)

    if (weatherHistory.length > 20) {
      weatherHistory.pop()
    }

    fastify.log.info(`Dato actualizado: Viento ${data.metrics.solar_wind_speed_km_s} km/s | Estado: ${data.metrics.status}`)
  } catch (error) {
    fastify.log.error('Error obteniendo datos del motor de predicción:', error.message)
  }
}

cron.schedule('*/5 * * * * *', () => {
  fetchSolarForecast()
})

fastify.get('/api/space-weather', async (request, reply) => {
  return reply.send({
    status: 'success',
    data: weatherHistory
  })
})

const start = async () => {
  try {
    await fetchSolarForecast()
    // Levantamos la API en el puerto 3001
    await fastify.listen({ port: 3001 })
    fastify.log.info(`API de Clima Espacial escuchando en el puerto 3001`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()