import fastifyPostgres from '@fastify/postgres';
import 'dotenv/config';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

/**
 * This plugins adds some utilities to handle postgres
 *
 * @see https://github.com/fastify/fastify-postgres
 */
export default fp(async function (fastify: FastifyInstance) {
  fastify.register(fastifyPostgres, {
    connectionString: `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@localhost/${process.env.DATABASE}`,
  });
});
