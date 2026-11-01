import type { Request, Response, NextFunction } from 'express';
import { deadlineService } from '../services/deadlines.services';


export const deadlinesController = {
    async getAll(req: Request, res: Response, next: NextFunction) {

        try {
            const deadlines = await deadlineService.getAll(req.user!.userId)
            res.json(deadlines)
        } catch (error: any) {
            next(error)
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const deadlines = await deadlineService.getById(req.params.id, req.user!.userId)
            res.json(deadlines)
        } catch (error: any) {
            next(error)
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const newDeadline = await deadlineService.create(req.user!.userId, req.body)
            res.status(201).json(newDeadline)
        } catch (error: any) {
            next(error)
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedDeadline = await deadlineService.update(req.params.id, req.user!.userId, req.body)
            res.json(updatedDeadline)
        } catch (error: any) {
            next(error)
        }
    },

    async markAsDone(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedDeadline = await deadlineService.markAsDone(req.params.id, req.user!.userId)
            res.json(updatedDeadline)
        } catch (error: any) {
            next(error)
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await deadlineService.delete(req.params.id, req.user!.userId)
            res.status(204).send()
        } catch (error: any) {
            next(error)
        }
    },
}
