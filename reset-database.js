import fs from 'fs'
import path from 'path'
import { app } from 'electron'

// Use Electron's user data directory for the database file
const userDataPath = app.getPath('userData')
const dbPath = path.join(userDataPath, 'students.db')

// Function to delete the existing database file if it exists
const deleteDatabase = () => {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath)
    console.log('Old database deleted.')
  }
}

// Function to create a new database file
// const createDatabase = () => {
//   const db = new sqlite3.Database(dbPath, (err) => {
//     if (err) {
//       console.error('Error creating database:', err.message)
//     } else {
//       console.log('Database created.')
//       db.serialize(() => {
//         db.run(
//           `CREATE TABLE IF NOT EXISTS students (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             age INTEGER NOT NULL,
//             grade TEXT NOT NULL
//           )`,
//           (err) => {
//             if (err) {
//               console.error('Error creating table:', err.message)
//             } else {
//               console.log('Table created.')
//             }
//             db.close()
//           }
//         )
//       })
//     }
//   })
// }

// Execute the functions
deleteDatabase()
