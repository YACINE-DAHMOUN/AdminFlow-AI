import type { Request, Response } from 'express';
import { deadlineService } from '../services/deadlines.services';


export const deadlinesController = {
    async getAll(req: Request, res: Response) {

        try {
            const deadlines = await deadlineService.getAll(req.user!.userId)
            res.json(deadlines)
        } catch (err: any) {
            res.status(500).json({ message: err.message })
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const deadlines = await deadlineService.getById(req.params.id, req.user!.userId)
            res.json(deadlines)
        } catch (err: any) {
            res.status(404).json({ message: err.message })
        }
    },

    async create(req: Request, res: Response) {
        try {
            const newDeadline = await deadlineService.create(req.user!.userId, req.body)
            res.status(201).json(newDeadline)
        } catch (err: any) {
            res.status(400).json({ message: err.message })
        }
    },

    async update(req: Request, res: Response) {
        try {
            const updatedDeadline = await deadlineService.update(req.params.id, req.user!.userId, req.body)
            res.json(updatedDeadline)
        } catch (err: any) {
            const status = err.message === 'Deadline introuvable' ? 404 : 400
            res.status(status).json({ message: err.message })
        }
    },

    async markAsDone(req: Request, res: Response) {
        try {
            const updatedDeadline = await deadlineService.markAsDone(req.params.id, req.user!.userId)
            res.json(updatedDeadline)
        } catch (err: any) {
            const status = err.message === 'Deadline introuvable' ? 404 : 500
            res.status(status).json({ message: err.message })
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const deletedDeadline = await deadlineService.delete(req.params.id, req.user!.userId)
            res.status(204).send()
        } catch (err: any) {
            res.status(404).json({ message: err.message })
        }
    },
}
