CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS events (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    venue VARCHAR(150) NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    capacity INTEGER NOT NULL 
        check (capacity >= 0),
    seats_remaining INTEGER NOT NULL 
        check (seats_remaining >= 0),
    organizer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(12) NOT NULL DEFAULT 'on_sale'
        check (status IN ('on_sale', 'sold_out', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS customers (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,

    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,

    quantity INTEGER NOT NULL
        CHECK(quantity > 0),

    status VARCHAR(12) NOT NULL DEFAULT 'confirmed'
        CHECK ( status IN ( 'confirmed', 'cancelled')),

    booked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

CREATE INDEX idx_bookings_event ON bookings(event_id);

CREATE INDEX idx_bookings_customer ON bookings(customer_id);

CREATE INDEX idx_events_status ON events(status);