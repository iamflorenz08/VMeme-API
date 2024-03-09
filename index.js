
import 'dotenv/config'
import Fastify from "fastify";
import mongoose from 'mongoose';
import fastifyCors from '@fastify/cors';
import AuthRoute from './routers/AuthRoute.js';
import ArtistsRoute from './routers/ArtistsRoute.js';
import PaintingsRoute from './routers/PaintingsRoute.js';
import CartRoute from './routers/CartRoute.js';
import OrderRoute from './routers/OrderRoute.js';
import UsersRoute from './routers/UsersRoute.js';
import DashboardRoute from './routers/DashboardRoute.js';
import PageRoute from './routers/PageRoute.js';
const port = process.env.PORT || 5000;
const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;

const fastify = Fastify()

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('DB Connected'))
    .catch(err => console.log(err.message))

fastify.register(fastifyCors, {
    origin: ['https://vmeme.vercel.app', 'http://localhost:3000']
})

fastify.register(AuthRoute, { prefix: '/api/v1/auth' })
fastify.register(ArtistsRoute, { prefix: '/api/v1/artist' })
fastify.register(PaintingsRoute, { prefix: '/api/v1/paintings' })
fastify.register(CartRoute, { prefix: '/api/v1/cart' })
fastify.register(OrderRoute, { prefix: '/api/v1/order' })
fastify.register(UsersRoute, { prefix: '/api/v1/user' })
fastify.register(DashboardRoute, { prefix: '/api/v1/dashboard' })
fastify.register(PageRoute, { prefix: '/api/v1/page' })

// Run the server!
try {
    setInterval(async () => {
        const res = await fetch('https://vmeme.onrender.com')
        console.log(res.ok)
    }, 1000 * 60 * 3)
    await fastify.listen({ host, port })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}