import { downloadPaintingsAvailable, downloadToBeIssued, downloadTransactionMade, getDocumentCounts } from "../controllers/DashboardController.js"

export default async (fastify, option) => {
    fastify.get('/', getDocumentCounts)
    fastify.get('/pdf/to-be-issued', downloadToBeIssued)
    fastify.get('/pdf/paintings-available', downloadPaintingsAvailable)
    fastify.get('/pdf/transaction-made', downloadTransactionMade)
}