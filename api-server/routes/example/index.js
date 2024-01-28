'use strict'

// In-memory data store for demonstration purposes
const dataStore = {};

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return 'this is an example 2'
  })

}
