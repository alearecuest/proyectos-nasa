const fastify = require('fastify')({ logger: true })
const axios = require('axios')

fastify.register(require('@fastify/cors'), { origin: '*' })

fastify.post('/api/search', async (request, reply) => {
  try {
    const { text } = request.body;

    if (!text) {
      return reply.status(400).send({ error: 'El campo text es obligatorio' });
    }

    const pythonResponse = await axios.post('http://127.0.0.1:8002/search', {
      text: text
    });

    return reply.send(pythonResponse.data);
  } catch (error) {
    fastify.log.error('Error en el microservicio NLP:', error.message);
    reply.status(500).send({ error: 'Error comunicándose con el motor de Inteligencia Artificial' });
  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3002 })
    fastify.log.info(`API de NLP (Earth Science) escuchando en el puerto 3002`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()