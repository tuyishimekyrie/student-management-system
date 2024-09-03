import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import db from '../../database' // Import the database module
import path from 'path'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../renderer/src/assets/logo.svg'),
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // Uncomment the line below for debugging
    // mainWindow.webContents.openDevTools()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const loadURL = process.env['ELECTRON_RENDERER_URL'] || join(__dirname, '../renderer/index.html')
  mainWindow.loadURL(loadURL).catch((err) => console.error('Failed to load content:', err))
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Register IPC handlers
  ipcMain.handle('add-student', async (event, student) => {
    const { firstname, lastname, contact, email, address, programName, tuitionFee } = student
    return new Promise((resolve) => {
      db.run(
        `INSERT INTO students (firstname, lastname, contact, email, address, program_name, tuition_fee) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [firstname, lastname, contact, email, address, programName, tuitionFee],
        function (err) {
          if (err) {
            console.error('Failed to add student:', err.message)
            resolve({ success: false })
          } else {
            resolve({ success: true })
          }
        }
      )
    })
  })

  ipcMain.handle('add-program', async (event, program) => {
    const { name, tuitionFee } = program
    return new Promise((resolve) => {
      db.run(
        'INSERT INTO programs (name, tuition_fee) VALUES (?, ?)',
        [name, tuitionFee],
        function (err) {
          if (err) {
            console.error('Failed to add program:', err.message)
            resolve({ success: false })
          } else {
            resolve({ success: true })
          }
        }
      )
    })
  })

  ipcMain.handle('get-programs', async () => {
    return new Promise((resolve) => {
      db.all('SELECT * FROM programs', [], (err, rows) => {
        if (err) {
          console.error('Failed to fetch programs:', err.message)
          resolve({ programs: [] })
        } else {
          resolve({ programs: rows })
        }
      })
    })
  })

  ipcMain.handle('get-programs-by-name', async () => {
    return new Promise((resolve) => {
      db.all('SELECT * FROM programs ORDER BY name', (err, rows) => {
        if (err) {
          console.error('Failed to fetch programs:', err.message)
          resolve({ success: false, programs: [] })
        } else {
          resolve({ success: true, programs: rows })
        }
      })
    })
  })

  ipcMain.handle('add-expense', async (event, expense) => {
    const { description, amount, person } = expense
    return new Promise((resolve) => {
      db.run(
        'INSERT INTO expenses (description, amount, person) VALUES (?, ?, ?)',
        [description, amount, person],
        function (err) {
          if (err) {
            console.error('Failed to add expense:', err.message)
            resolve({ success: false })
          } else {
            resolve({ success: true })
          }
        }
      )
    })
  })

  ipcMain.handle('get-expenses', async () => {
    return new Promise((resolve) => {
      db.all('SELECT * FROM expenses ORDER BY created_date DESC', (err, rows) => {
        if (err) {
          console.error('Failed to fetch expenses:', err.message)
          resolve({ success: false, expenses: [] })
        } else {
          resolve({ success: true, expenses: rows })
        }
      })
    })
  })

  ipcMain.handle('get-students', async () => {
    return new Promise((resolve) => {
      db.all('SELECT * FROM students', [], (err, rows) => {
        if (err) {
          console.error('Failed to fetch students:', err.message)
          resolve({ success: false })
        } else {
          resolve({ success: true, students: rows })
        }
      })
    })
  })

  ipcMain.handle('get-students-by-name', async () => {
    return new Promise((resolve) => {
      db.all('SELECT id, firstname, lastname FROM students', (err, rows) => {
        if (err) {
          console.error('Failed to fetch students:', err.message)
          resolve({ success: false })
        } else {
          resolve({ success: true, students: rows })
        }
      })
    })
  })

  ipcMain.handle('add-payment', async (event, { studentId, amount }) => {
    return new Promise((resolve) => {
      const today = new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format

      db.run(
        `INSERT INTO payments (student_id, amount, payment_date) VALUES (?, ?, ?)`,
        [studentId, amount, today],
        (err) => {
          if (err) {
            console.error('Failed to add payment:', err.message)
            resolve({ success: false })
          } else {
            // Update the student’s total_tuition and amount_paid
            db.run(
              `UPDATE students SET amount_paid = amount_paid + ? WHERE id = ?`,
              [amount, studentId],
              (err) => {
                if (err) {
                  console.error('Failed to update student record:', err.message)
                  resolve({ success: false })
                } else {
                  resolve({ success: true })
                }
              }
            )
          }
        }
      )
    })
  })

  ipcMain.handle('get-payments', async (event, studentId) => {
    return new Promise((resolve) => {
      db.all('SELECT * FROM payments WHERE student_id = ?', [studentId], (err, rows) => {
        if (err) {
          console.error('Failed to fetch payments:', err.message)
          resolve({ success: false })
        } else {
          resolve({ success: true, payments: rows })
        }
      })
    })
  })

  ipcMain.handle('get-all-payments', async () => {
    return new Promise((resolve) => {
      db.all('SELECT id, student_id, amount, payment_date FROM payments', [], (err, rows) => {
        if (err) {
          console.error('Failed to fetch payments:', err.message)
          resolve({ success: false })
        } else {
          resolve({ success: true, payments: rows })
        }
      })
    })
  })

  ipcMain.handle('get-total-users', async () => {
    return new Promise((resolve) => {
      db.get('SELECT COUNT(*) as count FROM students', [], (err, row) => {
        if (err) {
          console.error('Failed to fetch total users:', err.message)
          resolve({ success: false })
        } else {
          resolve({ success: true, totalUsers: row.count })
        }
      })
    })
  })

  ipcMain.handle('get-total-amount-paid', async () => {
    return new Promise((resolve) => {
      db.get('SELECT SUM(amount) as sum FROM payments', [], (err, row) => {
        if (err) {
          console.error('Failed to fetch total amount paid:', err.message)
          resolve({ success: false })
        } else {
          resolve({ success: true, totalAmountPaid: row.sum })
        }
      })
    })
  })

  ipcMain.handle('get-total-programs', async () => {
    return new Promise((resolve) => {
      db.get('SELECT COUNT(*) as count FROM programs', [], (err, row) => {
        if (err) {
          console.error('Failed to fetch total programs:', err.message)
          resolve({ success: false })
        } else {
          resolve({ success: true, totalPrograms: row.count })
        }
      })
    })
  })

  ipcMain.handle('get-total-expenses', async () => {
    return new Promise((resolve) => {
      db.get('SELECT SUM(amount) as sum FROM expenses', [], (err, row) => {
        if (err) {
          console.error('Failed to fetch total expenses:', err.message)
          resolve({ success: false })
        } else {
          resolve({ success: true, totalExpenses: row.sum })
        }
      })
    })
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
