import ArtistModel from '../models/ArtistModel.js'
import PaintingModel from '../models/PaintingModel.js'
import OrderModel from '../models/OrderModel.js'
import UserModel from '../models/UserModel.js'
import { generatePDFPaintingsAvailable, generatePDFToBeIssued, generatePDFTransactionMade } from '../utils/reports.js'

export const getDocumentCounts = async (request, reply) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const artistCount = ArtistModel.countDocuments()
        const paintingCount = PaintingModel.countDocuments()
        const pendingOrdersCount = OrderModel.countDocuments({ status: 'Pending' })
        const customerCount = UserModel.countDocuments()
        const paidPaintingsCount = OrderModel.countDocuments({ status: 'Confirmed' })
        const paintingsAvailableCount = PaintingModel.countDocuments({ status: 'Available' })
        const transactionMadeCount = OrderModel.countDocuments({
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        })

        const promises = await Promise.all([
            artistCount,
            paintingCount,
            pendingOrdersCount,
            customerCount,
            paidPaintingsCount,
            paintingsAvailableCount,
            transactionMadeCount
        ])

        return reply.status(200).send({
            artistCount: promises[0],
            paintingCount: promises[1],
            pendingOrdersCount: promises[2],
            customerCount: promises[3],
            paidPaintingsCount: promises[4],
            paintingsAvailableCount: promises[5],
            transactionMadeCount: promises[6],
        })
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const downloadToBeIssued = async (request, reply) => {
    try {
        const orderDB = await OrderModel.find({ status: 'Confirmed' }).populate({ path: 'orderedPaintings user', select: '-password -role' })
        const buffer = await generatePDFToBeIssued(orderDB)

        reply
            .header('Content-Type', 'application/pdf')
            .header('Content-Disposition', `attachment; filename="${new Date().valueOf()}-ToBeIssued.pdf"`)
            .send(buffer);
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const downloadPaintingsAvailable = async (request, reply) => {
    try {
        const paintingsDB = await PaintingModel.find({ status: 'Available' }).populate('artist')
        const buffer = await generatePDFPaintingsAvailable(paintingsDB)

        reply
            .header('Content-Type', 'application/pdf')
            .header('Content-Disposition', `attachment; filename="${new Date().valueOf()}-AvailablePaintings.pdf"`)
            .send(buffer);
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const downloadTransactionMade = async (request, reply) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const ordersDB = await OrderModel.find({
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        }).populate({ path: 'orderedPaintings user', select: '-password -role' })
        const buffer = await generatePDFTransactionMade(ordersDB)

        reply
            .header('Content-Type', 'application/pdf')
            .header('Content-Disposition', `attachment; filename="${new Date().valueOf()}-TransactionMadeToday.pdf"`)
            .send(buffer);
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}


