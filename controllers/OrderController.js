import CartModel from "../models/CartModel.js"
import OrderModel from "../models/OrderModel.js"
import OrderReferenceModel from "../models/OrderReferenceModel.js"
import PaintingModel from "../models/PaintingModel.js"
import { generatePDFReceipt } from "../utils/reports.js"
import { transport } from "../utils/transport.js"

const generateReceipt = (email, user) => {
    const pdf = generatePDFReceipt(user)
    pdf
        .then(async (buffer) => {
            const transporter = await transport()
            await transporter.sendMail({
                from: `"VMeme Contemporary Art Gallery" <${process.env.EMAIL}>`,
                to: email,
                subject: 'Receipt',
                html: `
            <h1>Your receipt</h1>
            `,
                attachments: {
                    filename: `${user.orderId ?? user.referenceID}-receipt.pdf`,
                    content: buffer,
                    contentType: 'application/pdf'
                }
            })
        })
        .catch(err => {
            return reply.status(400).send({
                success: false,
                message: err.message
            })
        })
}

export const addOrder = async (request, reply) => {
    try {
        const {
            user,
            email,
            phoneNumber,
            address,
            zipCode,
            referenceID,
        } = request.body
        const cartItemsDB = await CartModel.find({ user }).select('painting -_id').populate({ path: 'painting user' })
        if (!cartItemsDB || cartItemsDB.length <= 0) throw new Error('No ordered paintings.')


        const paintingReferencesIDs = await cartItemsDB.map(item => item.painting._id)
        const paintingReferences = await cartItemsDB.map(item => item.painting)
        await paintingReferences.forEach((value) => delete value._doc._id)
        const paintingReferencesDB = await OrderReferenceModel.insertMany(paintingReferences)
        const paintingReferencesDBIDs = await paintingReferencesDB.map(item => item._id)

        //add order
        const orderDB = await new OrderModel({
            orderId: 'VM' + new Date().valueOf(),
            user,
            email,
            phoneNumber,
            address,
            zipCode,
            referenceID,
            orderedPaintings: paintingReferencesDBIDs
        }).save()


        //make the items unavaible to users
        await PaintingModel.updateMany({ _id: { $in: paintingReferencesIDs } }, { $set: { status: 'Sold' } })

        //delete items in cart
        await CartModel.deleteMany({ user })


        generateReceipt(orderDB.email, {
            ...orderDB._doc,
            fullName: cartItemsDB[0].user.fullName,
            orderedPaintings: cartItemsDB.map(item => item.painting)
        })

        return reply.status(200).send({
            success: true,
            message: 'Item is on verification'
        })

    } catch (e) {

        console.log(e.message)
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const getUserOrders = async (request, reply) => {
    try {
        const { userID } = request.params
        const ordersDB = await OrderModel.find({ user: userID }).sort('-createdAt')
        return reply.status(200).send(ordersDB)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const getOrders = async (request, reply) => {
    try {
        const page = request.query.page || 1
        const limit = request.query.limit || null
        const search = request.query.search || null
        const totalDocuments = await OrderModel.countDocuments()
        const ordersDB = await OrderModel
            .find({
                referenceID: { $regex: search ? '.*' + search : '', $options: 'i' }
            })
            .sort('-createdAt')
            .limit(limit === 'all' ? null : limit)
            .skip(10 * (Number(page) === 1 ? 0 : Number(page) - 1))
            .populate({ path: 'orderedPaintings', populate: { path: 'artist', select: 'name' } })

        return reply.status(200).send({
            totalDocuments,
            page: Number(page),
            data: ordersDB
        })
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.errors.name.message || e.message
        })
    }
}

export const getOrder = async (request, reply) => {
    try {
        const { orderID } = request.params
        const orderDB = await OrderModel.findOne({ _id: orderID }).populate({ path: 'orderedPaintings', populate: { path: 'artist', select: 'name' } })
        if (!orderDB) throw new Error('Order doesn\'t exist')
        return reply.status(200).send(orderDB)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const updateStatus = async (request, reply) => {
    try {
        const { orderID } = request.params
        const { status } = request.body
        const orderDB = await OrderModel.findOne({ _id: orderID })
        if (!orderDB.confirmedDate && status === 'Confirmed') {
            orderDB.confirmedDate = Date.now()
        }
        else if ((!orderDB.completedDate && status === 'Completed') || (!orderDB.completedDate && status === 'Declined')) {
            orderDB.completedDate = Date.now()
        }

        orderDB.status = status
        orderDB.save()

        return reply.status(200).send({
            success: true,
            message: 'Updated.'
        })

    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

