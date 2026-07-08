import test from "node:test";
import assert from "node:assert/strict";

import { pool } from "../src/db/dbConnect.js";
import { createApp } from "../src/app.js";

let server;
let baseUrl;

let token;
let customerId;
let eventId;
let bookingId

function authHeaders() {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
}

async function json(res) {
    return await res.json();
}

test.before(async () => {
    server = createApp().listen(0);

    baseUrl = `http://localhost:${server.address().port}`;
});

test.after(async () => {
    server.close();
    await pool.end();
});

test("Health & Authentication", async (t) => {

    await t.test("GET /health returns OK", async () => {

        const res = await fetch(`${baseUrl}/health`);

        assert.equal(res.status, 200);

        const body = await json(res);

        assert.deepEqual(body, {
            status: "OK"
        });

    });

    await t.test("POST /auth/register creates a user", async () => {

        const res = await fetch(`${baseUrl}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "john@example.com",
                password: "password123"
            })
        });

        assert.equal(res.status, 201);

    });

    await t.test("Duplicate registration returns 409", async () => {

        const res = await fetch(`${baseUrl}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "john@example.com",
                password: "password123"
            })
        });

        assert.equal(res.status, 409);

    });

    await t.test("POST /auth/login returns JWT", async () => {

        const res = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "john@example.com",
                password: "password123"
            })
        });

        assert.equal(res.status, 200);

        const body = await json(res);

        token = body.data;

        assert.ok(token);

    });

    await t.test("Wrong password returns 401", async () => {

        const res = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "john@example.com",
                password: "wrongpassword"
            })
        });

        assert.equal(res.status, 401);

    });

});

test("Customers & Events", async (t) => {

    await t.test("Create customer", async () => {

        const res = await fetch(`${baseUrl}/customers`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({
                full_name: "John Doe",
                email: "john.customer@example.com"
            })
        });

        assert.equal(res.status, 201);

        const body = await json(res);

        customerId = body.data.id;

        assert.ok(customerId);

        assert.equal(body.data.full_name, "John Doe");
        assert.equal(body.data.email, "john.customer@example.com");

    });

    await t.test("Get single customer", async () => {

        const res = await fetch(
            `${baseUrl}/customers/${customerId}`
        );

        assert.equal(res.status, 200);

        const body = await json(res);

        assert.equal(body.data.id, customerId);
        assert.equal(body.data.full_name, "John Doe");
        assert.equal(body.data.email, "john.customer@example.com");

    });

    await t.test("Create event", async () => {

        const res = await fetch(`${baseUrl}/events`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({
                name: "Node Conference",
                venue: "Douala",
                starts_at: "2026-12-20T10:00:00Z",
                capacity: 20
            })
        });

        assert.equal(res.status, 201);

        const body = await json(res);

        eventId = body.data.id;

        assert.ok(eventId);

        assert.equal(body.data.name, "Node Conference");
        assert.equal(body.data.venue, "Douala");
        assert.equal(body.data.capacity, 20);
        assert.equal(body.data.seats_remaining, 20);
        assert.equal(body.data.status, "on_sale");

    });

    await t.test("Get single event", async () => {

        const res = await fetch(
            `${baseUrl}/events/${eventId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        assert.equal(res.status, 200);

        const body = await json(res);

        assert.equal(body.data.id, eventId);
        assert.equal(body.data.capacity, 20);
        assert.equal(body.data.seats_remaining, 20);
        assert.equal(body.data.status, "on_sale");

    });

    await t.test("List events", async () => {

        const res = await fetch(
            `${baseUrl}/events`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        assert.equal(res.status, 200);

        const body = await json(res);

        assert.ok(Array.isArray(body.data));
        assert.ok(body.data.length >= 1);

        assert.ok("nextCursor" in body);

    });

});

test("Bookings", async (t) => {

    await t.test("Create booking", async () => {

        const res = await fetch(
            `${baseUrl}/events/${eventId}/bookings`,
            {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({
                    customer_id: customerId,
                    quantity: 4
                })
            }
        );

        assert.equal(res.status, 201);

        const body = await json(res);

        bookingId = body.data.id;

        assert.ok(bookingId);

        assert.equal(body.data.customer_id, customerId);
        assert.equal(body.data.event_id, eventId);
        assert.equal(body.data.quantity, 4);
        assert.equal(body.data.status, "confirmed");

    });

    await t.test("Seats remaining decreases after booking", async () => {

        const res = await fetch(
            `${baseUrl}/events/${eventId}`,
            {
                headers: authHeaders()
            }
        );

        assert.equal(res.status, 200);

        const body = await json(res);

        assert.equal(body.data.seats_remaining, 16);

    });

    await t.test("Get booking", async () => {

        const res = await fetch(
            `${baseUrl}/bookings/${bookingId}`,
            {
                headers: authHeaders()
            }
        );

        assert.equal(res.status, 200);

        const body = await json(res);

        assert.equal(body.data.id, bookingId);
        assert.equal(body.data.quantity, 4);
        assert.equal(body.data.status, "confirmed");

    });

    await t.test("List bookings for event", async () => {

        const res = await fetch(
            `${baseUrl}/events/${eventId}/bookings`,
            {
                headers: authHeaders()
            }
        );

        assert.equal(res.status, 200);

        const body = await json(res);

        assert.ok(Array.isArray(body.data));

        assert.ok(body.data.length >= 1);

        assert.ok("nextCursor" in body);

    });

    await t.test("Cancel booking", async () => {

        const res = await fetch(
            `${baseUrl}/bookings/${bookingId}/cancel`,
            {
                method: "POST",
                headers: authHeaders()
            }
        );

        assert.equal(res.status, 204);

    });

    await t.test("Seats are restored after cancellation", async () => {

        const res = await fetch(
            `${baseUrl}/events/${eventId}`,
            {
                headers: authHeaders()
            }
        );

        assert.equal(res.status, 200);

        const body = await json(res);

        assert.equal(body.data.seats_remaining, 20);

    });

    await t.test("Cancelling twice returns 409", async () => {

        const res = await fetch(
            `${baseUrl}/bookings/${bookingId}/cancel`,
            {
                method: "POST",
                headers: authHeaders()
            }
        );

        assert.equal(res.status, 409);

    });

});