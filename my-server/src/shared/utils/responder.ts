import { type Response } from 'express'

export function responder(
  res:Response,
  status: number,
  data: any
) {
  return res.status(status).json(data)
}