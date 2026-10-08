const fastify = require('fastify')({ logger: true })
const axios = require('axios')
const FormData = require('form-data');

fastify.register(require('@fastify/cors'), { origin: '*' })

fastify.register(require('@fastify/multipart'), {
  limits: {
    fileSize: 20 * 1024 * 1024 // Límite ampliado a 20 MB
  }
})

fastify.post('/analyze-lunar-image', async (request, reply) => {
  const data = await request.file()

  const formData = new FormData();
  formData.append('file', await data.toBuffer(), data.filename);

  try {
    const pythonResponse = await axios.post('http://127.0.0.1:8000/predict-craters', formData, {
      headers: formData.getHeaders()
    });

    return reply.send({
      message: 'Análisis completado',
      data: pythonResponse.data
    })
  } catch (error) {
    fastify.log.error(error)
    reply.status(500).send({ error: 'Error comunicándose con el modelo de IA' })
  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    fastify.log.info(`Servidor API escuchando en el puerto 3000`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
