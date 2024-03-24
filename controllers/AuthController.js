
import UserModel from "../models/UserModel.js"
import OTPModel from "../models/OTPModel.js"
import bcrypt from 'bcrypt'
import otpGenerator from "otp-generator"
import { transport } from "../utils/transport.js"

export const signup = async (request, reply) => {
    const saltRound = 10
    try {
        const userBody = request.body

        await new UserModel({
            ...userBody,
            password: await bcrypt.hash(userBody.password, saltRound)
        }).save()

        return reply.status(200).send({
            success: true,
            message: "Successfully created."
        })

    } catch (e) {
        if (e.name === 'MongoServerError' && e.code) {
            return reply.status(400).send({
                success: false,
                message: 'Email is in used.'
            })
        }

        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const signin = async (request, reply) => {
    try {
        const { email, password } = request.body
        const userDB = await UserModel.findOne({ email }).select('password')
        if (!userDB) throw new Error('Email not found.')

        const isPasswordMatch = await bcrypt.compare(password, userDB.password)

        if (!isPasswordMatch) throw new Error('Password doesn\'t match.')

        return reply.status(200).send({
            success: true,
            message: "User signed in."
        })

    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const otp = async (request, reply) => {
    try {
        const { email } = request.body
        const userCount = await UserModel.countDocuments({ email })
        if (!userCount) throw new Error('Email not found.')

        const OTP = await generateOTP(email)
        await sendEmail(email, OTP)

        return reply.status(200).send({
            success: true,
            message: 'OTP generated. Please check your email.'
        })

    } catch (e) {
        if (e.name === 'MongoServerError' && e.code) {
            return reply.status(400).send({
                success: false,
                message: 'There is existing OTP. Try again later.'
            })
        }

        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}


export const otpVerify = async (request, reply) => {
    try {
        const { email, otp } = request.body
        const otpDB = await OTPModel.findOne({ email }).select('otp')

        if (!otpDB) throw new Error('OTP has been expired.')

        if (otpDB.otp !== otp) throw new Error('OTP doesn\'t match.')

        const userDB = await UserModel.findOne({ email }).select('-password')

        if (!otpDB) throw new Error('User isn\'t registered.')

        return reply.status(200).send(userDB)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

const generateOTP = async (email) => {
    try {
        const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false })
        await new OTPModel({
            email,
            otp
        }).save()
        return otp
    } catch (e) {
        if (e.name === 'MongoServerError' && e.code) {
            throw new Error('There is existing OTP. Try again later.')
        }
        throw new Error(e.message)
    }
}

const sendEmail = async (email, otp) => {
    try {
        const transporter = await transport()
        await transporter.sendMail({
            from: `"VMeme Contemporary Art Gallery" <${process.env.EMAIL}>`,
            to: email,
            subject: 'One-Time Password',
            html: `
            <h1>Your OTP: ${otp}</h1>
            `,
        })
    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}
