#! /usr/bin/env node

const { Client } = require("pg");
require('dotenv').config();

// The SQL script to create tables and insert initial data
const SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock_qty INTEGER DEFAULT 0 CHECK (stock_qty >= 0),
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);

INSERT INTO categories (name, description) VALUES
  ('Synthesizers', 'Analog and digital keyboards and modules'),
  ('Drum Machines', 'Classic beat-making hardware'),
  ('Accessories', 'Cables, cases, and expansion cards')
ON CONFLICT (name) DO NOTHING;

INSERT INTO items (name, description, price, stock_qty, category_id) VALUES
  ('Minimoog Model D', 'The classic analog monosynth.', 3500.00, 2, 1),
  ('Roland TR-808', 'The legendary boom-maker.', 4200.00, 1, 2)
ON CONFLICT DO NOTHING;
`;

async function main() {
    console.log("Seeding database...");

    // Use connectionString from environment variable
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        await client.query(SQL);
        console.log("Database seeded successfully!");
    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        await client.end();
    }
}

main();