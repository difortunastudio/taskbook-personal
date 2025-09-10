const sqlite3 = require('sqlite3').verbose()
const { Client } = require('pg')

async function syncData() {
  try {
    console.log('🔄 Iniciando sincronización SQLite → PostgreSQL...')

    // Conexión a SQLite local
    const db = new sqlite3.Database('./prisma/dev.db')
    
    // Conexión a PostgreSQL (Neon)
    const client = new Client({
      connectionString: process.env.PRODUCTION_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
    
    await client.connect()
    console.log('✅ Conectado a ambas bases de datos')

    // Helper para ejecutar queries en SQLite
    const sqliteQuery = (query) => {
      return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        })
      })
    }

    // 1. Sincronizar usuarios
    console.log('📤 Sincronizando usuarios...')
    const users = await sqliteQuery('SELECT * FROM users')
    
    for (const user of users) {
      await client.query(`
        INSERT INTO "User" (id, email, password, name, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO UPDATE SET
          password = EXCLUDED.password,
          name = EXCLUDED.name,
          "updatedAt" = EXCLUDED."updatedAt"
      `, [user.id, user.email, user.password, user.name, user.createdAt, user.updatedAt])
    }
    console.log(`✅ ${users.length} usuarios sincronizados`)

    // 2. Sincronizar empresas
    console.log('📤 Sincronizando empresas...')
    const companies = await sqliteQuery('SELECT * FROM companies')
    
    for (const company of companies) {
      await client.query(`
        INSERT INTO "Company" (id, name, email, phone, address, cif, "accountNumber", password, color, notes, "createdAt", "updatedAt", "userId")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          cif = EXCLUDED.cif,
          "accountNumber" = EXCLUDED."accountNumber",
          password = EXCLUDED.password,
          color = EXCLUDED.color,
          notes = EXCLUDED.notes,
          "updatedAt" = EXCLUDED."updatedAt"
      `, [company.id, company.name, company.email, company.phone, company.address, 
          company.cif, company.accountNumber, company.password, company.color, 
          company.notes, company.createdAt, company.updatedAt, company.userId])
    }
    console.log(`✅ ${companies.length} empresas sincronizadas`)

    // 3. Sincronizar proyectos
    console.log('📤 Sincronizando proyectos...')
    const projects = await sqliteQuery('SELECT * FROM projects')
    
    for (const project of projects) {
      await client.query(`
        INSERT INTO "Project" (id, name, description, "createdAt", "updatedAt", "userId", "companyId")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          "updatedAt" = EXCLUDED."updatedAt"
      `, [project.id, project.name, project.description, project.createdAt, 
          project.updatedAt, project.userId, project.companyId])
    }
    console.log(`✅ ${projects.length} proyectos sincronizados`)

    // 4. Sincronizar tareas
    console.log('📤 Sincronizando tareas...')
    const tasks = await sqliteQuery('SELECT * FROM tasks')
    
    for (const task of tasks) {
      await client.query(`
        INSERT INTO "Task" (id, title, description, completed, "dueDate", notes, "createdAt", "updatedAt", "userId", "companyId", "projectId")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          completed = EXCLUDED.completed,
          "dueDate" = EXCLUDED."dueDate",
          notes = EXCLUDED.notes,
          "updatedAt" = EXCLUDED."updatedAt"
      `, [task.id, task.title, task.description, task.completed, task.dueDate,
          task.notes, task.createdAt, task.updatedAt, task.userId, task.companyId, task.projectId])
    }
    console.log(`✅ ${tasks.length} tareas sincronizadas`)

    // Cerrar conexiones
    db.close()
    await client.end()
    
    console.log('🎉 ¡Sincronización completada exitosamente!')
    
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error)
  }
}

syncData()
