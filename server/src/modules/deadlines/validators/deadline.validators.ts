import {z} from 'zod'

export const createDeadlineSchema = z.object({

    title: z.string().min(1, 'Le titre est requis'),
    description: z.string().optional(),
    dueDate: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: 'Date invalide',
    }),
    type: z.enum([ 'URSSAF', 'IMPOTS','BANQUE','FACTURE','COURRIER', 'OTHER'], {  message: 'Type de deadline invalide'}),
documentId: z.string().uuid('ID de document invalide').optional(),

})
    export const updateDeadlineSchema = createDeadlineSchema.partial()
    export type CreateDeadlineDto = z.infer<typeof createDeadlineSchema>
    export type UpdateDeadlineDto = z.infer<typeof updateDeadlineSchema>