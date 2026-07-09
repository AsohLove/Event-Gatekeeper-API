# Gatekeeper API

## :beginner: Overview 

A RESTful Event Ticketing and Booking API built with **Node.js**, **Express**, and **PostgreSQL**.

Gatekeeper allows organizers to create events with limited capacity while allowing customers to book tickets safely. The booking system is fully transactional, preventing overselling even when multiple users attempt to reserve the last available seats simultaneously.

---

## 
## :sparkles: Features

* User Registration and login
* JWT Authentication
* Customer Management
* Event Management
* Transaction-safe Ticket Booking
* Booking Cancellation
* Concurrency-safe Seat Reservation
* Keyset Pagination
* PostgreSQL Transactions
* Zod Validation
* OpenAPI Documentation with Swagger UI
* SQL Injection Protection
* Comprehensive Automated Tests using `node:test`

---

## :toolbox: Tech Stack

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication and bcrypt
* Zod
* OpenAPI 3.0 / Swagger UI
* Helmet
* CORS
* Pino HTTP
* express-rate-limit
* node:test

---

## Project Structure

```
Gatekeeper-api
│
├── db
│   ├── schemas.sql
│   └── seed.sql
│
├── docs
│   └── openapi.yaml
|── lib
    |── logger.js
    |── jwt.js
    |── password.js
│
├── scripts
│   ├── reset-database.js
│   ├── schema.js
│   └── seed.js
│
├── src
│   ├── controllers
│   ├── db
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── app.js
    |── config.js
│   └── server.js
│
├── test
│   └── gatekeeper.test.js
|── validations
│
├── package.json
|── render.yaml
└── README.md
```

---

## Booking Transactions

Booking tickets is fully transactional.

When two customers attempt to purchase the last remaining seats simultaneously, only one transaction succeeds.

The booking algorithm performs an atomic conditional update.

```sql
UPDATE events
SET seats_remaining = seats_remaining - $1
WHERE id = $2
AND seats_remaining >= $1;
```

If the update affects zero rows, the booking is rejected with **409 Conflict**.

This guarantees that the API never oversells tickets.

---

## :electric_plug: Installation

### 1. Clone the repository

```bash
git clone https://github.com/AsohLove/Event-Gatekeeper-API.git

cd Gatekeeper-api
```


### 2. Install dependencies

```bash
npm install
```

### 3. Create a PostgreSQL database

Example:

```sql
CREATE DATABASE gatekeeper;
CREATE DATABASE gatekeeper_test;
```

### 4. Configure environment variables

Create a `.env` file.

```env
PORT=3000

DATABASE_URL=postgres://postgres:password@localhost:5432/gatekeeper

JWT_SECRET=your_secret_key

LOG_LEVEL=info
```

Create a `.env.test` file.

```env
PORT=3001

DATABASE_URL=postgres://postgres:password@localhost:5432/gatekeeper_test

JWT_SECRET=your_secret_key

NODE_ENV=test
```

### 5. Run database migrations

```bash
npm run migrate
```

### 6. (Optional) Seed the database

```bash
npm run seed
```

### 7. Start the application

Development

```bash
npm run dev # Uses the node built-in --watch  for automatic reload
```

Production

```bash
npm start
```

The API will be available at

```
http://localhost:3000
```

---

## Running the Application

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

## Running Tests

Run every automated test.

```bash
npm test
```
![samples successful test run](./Test-suite.png)


## Swagger Documentation

Interactive API documentation is available at

```
/docs
```
![Swagger Docs](./Gatekeeper-Docs.png)

---

## Authentication

Protected endpoints require a JWT.

1. Register a user

```
POST /auth/register
```

2. Login

```
POST /auth/login
```

3. Copy the returned JWT.

4. Click the **Authorize** button inside Swagger UI.

5. Paste

```
Bearer <JWT>
```

You can now access protected endpoints.

---

## API Endpoints

| Method | Endpoint              | Description       |
| ------ | --------------------- | ----------------- |
| GET    | /                     | API information   |
| GET    | /health               | Health check      |
| POST   | /auth/register        | Register user     |
| POST   | /auth/login           | Login             |
| POST   | /customers            | Create customer   |
| GET    | /customers/{id}       | Retrieve customer |
| POST   | /events               | Create event      |
| GET    | /events               | List events       |
| GET    | /events/{id}          | Retrieve event    |
| POST   | /events/{id}/bookings | Create booking    |
| GET    | /events/{id}/bookings | List bookings     |
| GET    | /bookings/{id}        | Retrieve booking  |
| POST   | /bookings/{id}/cancel | Cancel booking    |

---

Common status codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 404  | Not Found             |
| 409  | Conflict              |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |

---


## Deployment

Production deployment is hosted on Render and the database is saved on **Neon**

Required environment variables:

```env
DATABASE_URL=
JWT_SECRET=
PORT=
LOG_LEVEL=
```

API

```
https://event-gatekeeper-api.onrender.com/
```

Swagger

```
https://event-gatekeeper-api.onrender.com/docs
```

Health Check
```
https://event-gatekeeper-api.onrender.com/health
```

## Future Improvement Points

Possible future enhancements include

* Multiple Ticket Tiers
* Waitlists
* Time-limited Seat Holds
* Email Notifications
* Idempotency Keys
* Payment Integration
* Organizer Dashboard


- GitHub: [@loveasoh](https://github.com/AsohLove)
- Twitter: [@loveasoh](https://x.com/LoveTheModifier)
- LinkedIn: [@love asoh](https://www.linkedin.com/in/asohlove/)

:earth_africa: Based in Cameroon | Open for hybrid opportunities


## :lock: License
This project is [MIT](./LICENSE) licensed.
