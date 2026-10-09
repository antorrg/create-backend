import type { FastifyReply } from 'fastify';

export function responder(
  reply: FastifyReply,
  status: number,
  data: any
) {
  return reply.status(status).send(data)
}