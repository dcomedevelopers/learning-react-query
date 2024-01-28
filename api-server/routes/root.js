'use strict'

// In-memory data store for demonstration purposes
const dataStore = {};

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })

  // Create endpoint
  fastify.post('/api/resource', async (request, reply) => {
    const { body } = request;
    const id = Math.random().toString(36).substring(7);
    dataStore[id] = { id, ...body };
    reply.code(201).send({ id, ...body });
  });

  // Read endpoint
  fastify.get('/api/resource/:id', async (request, reply) => {
    const { id } = request.params;
    const resource = dataStore[id];
    if (!resource) {
      reply.code(404).send({ error: 'Resource not found' });
      return;
    }
    reply.send(resource);
  });

  // List all resources endpoint
  fastify.get('/api/resources', async (request, reply) => {
    const resources = Object.values(dataStore);
    reply.send(resources);
  });

  // Update endpoint
  fastify.put('/api/resource/:id', async (request, reply) => {
    const { id } = request.params;
    const { body } = request;
    const existingResource = dataStore[id];
    if (!existingResource) {
      reply.code(404).send({ error: 'Resource not found' });
      return;
    }
    dataStore[id] = { ...existingResource, ...body };
    reply.send({ id, ...dataStore[id] });
  });

  // Delete endpoint
  fastify.delete('/api/resource/:id', async (request, reply) => {
    const { id } = request.params;
    const resource = dataStore[id];
    if (!resource) {
      reply.code(404).send({ error: 'Resource not found' });
      return;
    }
    delete dataStore[id];
    reply.send({ message: 'Resource deleted successfully' });
  });
}
