
export const expressLoggerController = {
subPath:`LoggerController.ts`,
file: `import { type Request, type Response } from 'express'
import { type LoggerServiceDb } from './LoggerServiceDb.js'

export class LoggerController {
  protected service: LoggerServiceDb

  constructor (service: LoggerServiceDb) {
    this.service = service
  }

  getAll = async (req: Request, res: Response) => {
    const query = (req as any)?.context?.query ?? req.query
    const { info, data } = await this.service.getAll(query)
    res.status(200).json({ message: 'OK', data: { info, data } })
  }

  getById = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }
    const results = await this.service.getById(id)
    res.status(200).json({ message: 'OK', data:results })
  }

  update = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }
    const newData = req.body
    const { message, data } = await this.service.update(id, newData)
    res.status(200).json({ message, data })
  }

  delete = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }
    const data = await this.service.delete(id)
    res.status(200).json({ data })
  }

  deleteAll = async (_req: Request, res: Response) => {
    const response = await this.service.deleteAll()
    res.status(200).json({ data: response })
  }
}`
}
