import express from 'express';
import createError from 'http-errors';

import eventRouter from './routes/event-routes.js'
import authRouter from './routes/auth-routes.js'
import { requireAuth } from './middleware/auth-middleware.js';

import bookingRoutes from './routes/booking-routes.js';


export  function createApp(){
    
    const app = express()

    app.use(express.json())


    app.use('/health', (req, res) => {
        res.json({
            status: "OK"
        })
    })

    app.use('/auth', authRouter);

    app.use('/events',requireAuth, eventRouter);

    app.use('/', bookingRoutes);


    app.use((req, res, next) => {
        next(createError(404, "Event not found"))
    })

    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    });





    return app
}