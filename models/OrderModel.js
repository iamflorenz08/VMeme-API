import { Schema, model } from 'mongoose'

const orderSchema = new Schema({
    orderId: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    zipCode: {
        type: Number,
        required: true,
    },
    paymentMethods: {
        type: String,
        enum: ['GCash', 'BPI'],
        default: 'GCash',
        required: true,
    },
    referenceID: {
        type: String,
        required: true,
    },
    orderedPaintings: [{
        type: Schema.Types.ObjectId,
        ref: 'orderReference'
    }],
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Declined'],
        default: 'Pending',
        required: true,
    },
    confirmedDate: {
        type: Date,
        default: null
    },
    completedDate: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const OrderModel = model('order', orderSchema)

export default OrderModel