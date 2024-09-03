import path from 'path'
import sqlite3 from 'sqlite3'
import { app } from 'electron'

const getAppPath = () => {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'students.db')
    : path.join(__dirname, '..', '..', 'students.db')
}

const dbPath = getAppPath()

console.log('Database Path:', dbPath)

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message)
  } else {
    console.log('Connected to the SQLite database.')
  }
})

// Define table creation functions
const createTables = () => {
  db.serialize(() => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        contact TEXT NOT NULL,
        email TEXT NOT NULL,
        address TEXT NOT NULL,
        program_name TEXT NOT NULL,
        tuition_fee REAL,
        amount_paid REAL DEFAULT 0
      )
    `,
      (err) => {
        if (err) {
          console.error('Error creating students table:', err.message)
        }
      }
    )

    db.run(
      `
      CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        tuition_fee REAL NOT NULL
      )
    `,
      (err) => {
        if (err) {
          console.error('Error creating programs table:', err.message)
        }
      }
    )

    db.run(
      `
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        person TEXT NOT NULL,
        created_date TEXT DEFAULT (datetime('now'))
      )
    `,
      (err) => {
        if (err) {
          console.error('Error creating expenses table:', err.message)
        }
      }
    )

    db.run(
      `
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        payment_date TEXT DEFAULT CURRENT_DATE,
        FOREIGN KEY (student_id) REFERENCES students(id)
      )
    `,
      (err) => {
        if (err) {
          console.error('Error creating payments table:', err.message)
        }
      }
    )
  })
}

createTables()

export default db
