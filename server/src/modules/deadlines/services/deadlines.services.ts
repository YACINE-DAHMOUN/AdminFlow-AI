import { prisma } from '../../../core/config/prisma'
import type { CreateDeadlineDto, UpdateDeadlineDto } from '../validators/deadline.validators'


export const deadlineService = {

    async getAll (userId: string) {
        return await prisma.deadline.findMany({
            where: { userId },
            orderBy: { dueDate: 'asc' },
        })
    },

    async getById (id: string, userId: string) {
        const deadline = await prisma.deadline.findFirst({
            where: { id, userId },
        })
        if (!deadline) throw new Error('Deadline introuvable')
        return deadline
    },

    async create (userId: string , dto: CreateDeadlineDto) {
        return await prisma.deadline.create({
            data: {
                userId,
                title: dto.title,
                description: dto.description,
                dueDate: new Date(dto.dueDate),
                type: dto.type,
                documentId: dto.documentId || null,
            },
        })
    },
    async update(id: string, userId: string, dto: UpdateDeadlineDto) {
    return await prisma.deadline.updateMany({
        where: { id, userId },
        data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.dueDate && { dueDate: new Date(dto.dueDate) }),
        ...(dto.type && { type: dto.type }),
        ...(dto.documentId !== undefined && { documentId: dto.documentId }),
        },
    })
    },

    async markAsDone (id: string, userId: string) {

        const deadline = await prisma.deadline.findFirst({
            where: { id, userId } })
            if (!deadline) throw new Error('Deadline introuvable')
            return prisma.deadline.update({
                where: { id },
                data: { status: 'DONE' },
            })
        },
   

    async delete (id: string, userId: string) {
        return await prisma.deadline.deleteMany({
            where: { id, userId },
        })
    }
}   
