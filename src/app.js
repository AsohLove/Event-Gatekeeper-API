import express from 'express';
import createError from 'http-errors';

import eventRouter from './routes/event-routes.js'

export  function createApp(){
    
    const app = express()

    app.use(express.json())


    app.use('/health', (req, res) => {
        res.json({
            status: "OK"
        })
    })

    app.use('/events', eventRouter);


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