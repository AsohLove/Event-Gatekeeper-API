import * as events from '../models/event-model.js'
import createError from 'http-errors'

export async function createNewEvent(req, res, next) {
    try {
        const created = await events.createEvent(req.body);

        res.status(201).json({
            success: true,
            data: created
        });
    } catch (err) {
        next(err)
    }
}

export async function getSingleEvent(req, res, next){
    try {
        
        const event = await events.findEventById(req.params.id);

        if (!event) {
            throw createError(404, "Event is not found")
        }

        res.json({
            success: true,
            data: event
        })

    } catch (err) {
            next(err)
    }
}

export async function getEvents(req, res, next){
    try {
        const {after, limit } = req.validatedQuery;

        const eventRows = await events.findEvents(after, limit);

        res.json({
            success: true,
            data: eventRows,
            nextCursor:
                eventRows.length ? eventRows.at(-1).id : null
        });
    } catch (err) {
        next(err)
    }
}