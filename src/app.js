import express from 'express';
import createError from 'http-errors';


import eventRouter from './routes/event-routes.js'
import authRouter from './routes/auth-routes.js'
import bookingRoutes from './routes/booking-routes.js';
import customerRoutes from './routes/customer-routes.js'

import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import rateLimit from "express-rate-limit"

import { mountDocs } from './routes/docRoute.js';

export  function createApp(){
    
    const app = express()

    app.set('trust proxy', 1)

    app.use(helmet({ contentSecurityPolicy: false }))

    app.use(cors());

    app.use(pinoHttp())

    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            standardHeaders: true
        })
    )

    app.use(express.json())

    app.get("/", (req, res) => {
      res.status(200).json({
            success: true,
            name: "Gatekeeper API: Event ticketing and Booking!!!",
            version: "1.0.0",
            description:
                "A REST API for booking events with limited capacities.",
            docs: "/docs",
            health: "/health"
        });
    });


    app.use('/health', (req, res) => {
        res.json({
            status: "OK"
        })
    })


    mountDocs(app)

    app.use('/auth', authRouter);

    app.use('/events', eventRouter);
    
    app.use('/customers', customerRoutes);

    app.use('/', bookingRoutes);



    app.use((req, res, next) => {
        next(createError(404, "Resource not found"))
    })

    app.use((err, req, res, next) => {

        req.log.error(err);

        res.status(err.status || 500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    });


    return app
}