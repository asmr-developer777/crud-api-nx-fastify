import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IParams, ProductData } from 'src/app/interfaces/products';

export default async function (fastify: FastifyInstance) {
  /**
   * Get all products
   */
  fastify.get(
    '/',
    async function (request: FastifyRequest, reply: FastifyReply) {
      return fastify.pg.transact(async (client) => {
        const { rows } = await client.query('SELECT * FROM products');

        reply.status(200).send(rows);
      });
    }
  );

  /**
   * Get one product by ID
   */
  fastify.get(
    '/:id',
    async (
      request: FastifyRequest<{ Params: IParams }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      return fastify.pg.transact(async (client) => {
        const { rows } = await client.query(
          'SELECT * FROM products WHERE id = $1',
          [id]
        );

        reply.status(200).send(...rows);
      });
    }
  );

  /**
   * Add new product
   */
  fastify.post(
    '/add',
    async (
      request: FastifyRequest<{ Body: ProductData }>,
      reply: FastifyReply
    ) => {
      const { title, description, price, brand, category, thumbnail, images } =
        request.body;
      return fastify.pg.transact(async (client) => {
        await client.query(
          'INSERT INTO products(title, description,price, brand, category, thumbnail, images) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
          [title, description, price, brand, category, thumbnail, images]
        );

        reply
          .status(200)
          .send({ msg: 'added product to database', status: 'ok' });
      });
    }
  );

  /**
   * Update product by ID
   */
  fastify.put(
    '/:id',
    async (
      request: FastifyRequest<{ Params: IParams; Body: ProductData }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const { title, description, price, brand, category, thumbnail, images } =
        request.body;
      return fastify.pg.transact(async (client) => {
        await client.query(
          'UPDATE products SET title = $1, description = $2, price = $3, brand = $4, category = $5, thumbnail = $6, images = $7 WHERE id = $8',
          [title, description, price, brand, category, thumbnail, images, id]
        );

        reply
          .status(200)
          .send({ msg: `updated product with id: ${id}`, status: 'ok' });
      });
    }
  );

  /**
   * Delete product by ID
   */
  fastify.delete(
    '/:id',
    async (
      request: FastifyRequest<{ Params: IParams }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      return fastify.pg.transact(async (client) => {
        await client.query('DELETE FROM products WHERE id = $1', [id]);

        reply
          .status(200)
          .send({ msg: `deleted product with id: ${id}`, status: 'ok' });
      });
    }
  );
}
