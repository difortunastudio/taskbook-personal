const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function exportData() {
  try {
    console.log('🔍 Exportando datos de la base de datos local...')
    
    // Exportar usuarios
    const users = await prisma.user.findMany()
    console.log(`👥 Usuarios encontrados: ${users.length}`)
    
    // Exportar empresas
    const companies = await prisma.company.findMany()
    console.log(`🏢 Empresas encontradas: ${companies.length}`)
    
    // Exportar proyectos
    const projects = await prisma.project.findMany()
    console.log(`📋 Proyectos encontrados: ${projects.length}`)
    
    // Exportar tareas
    const tasks = await prisma.task.findMany()
    console.log(`✅ Tareas encontradas: ${tasks.length}`)
    
    // Guardar en archivo JSON
    const exportData = {
      users,
      companies, 
      projects,
      tasks,
      exportDate: new Date().toISOString()
    }
    
    fs.writeFileSync('data-export.json', JSON.stringify(exportData, null, 2))
    console.log('✅ Datos exportados a data-export.json')
    
    // Crear script SQL para importar
    let sqlScript = '-- TaskBook Data Export\n-- Generated: ' + new Date().toISOString() + '\n\n'
    
    // Insertar usuarios
    if (users.length > 0) {
      sqlScript += '-- Usuarios\n'
      users.forEach(user => {
        sqlScript += `INSERT INTO "User" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('${user.id}', ${user.name ? `'${user.name.replace(/'/g, "''")}'` : 'NULL'}, '${user.email}', ${user.emailVerified ? `'${user.emailVerified.toISOString()}'` : 'NULL'}, ${user.image ? `'${user.image}'` : 'NULL'}, '${user.createdAt.toISOString()}', '${user.updatedAt.toISOString()}') ON CONFLICT (id) DO NOTHING;\n`
      })
      sqlScript += '\n'
    }
    
    // Insertar empresas
    if (companies.length > 0) {
      sqlScript += '-- Empresas\n'
      companies.forEach(company => {
        sqlScript += `INSERT INTO "Company" (id, name, email, phone, address, cif, "accountNumber", password, color, notes, "userId", "createdAt", "updatedAt") VALUES ('${company.id}', '${company.name.replace(/'/g, "''")}', ${company.email ? `'${company.email}'` : 'NULL'}, ${company.phone ? `'${company.phone}'` : 'NULL'}, ${company.address ? `'${company.address.replace(/'/g, "''")}'` : 'NULL'}, ${company.cif ? `'${company.cif}'` : 'NULL'}, ${company.accountNumber ? `'${company.accountNumber}'` : 'NULL'}, ${company.password ? `'${company.password.replace(/'/g, "''")}'` : 'NULL'}, '${company.color}', ${company.notes ? `'${company.notes.replace(/'/g, "''")}'` : 'NULL'}, '${company.userId}', '${company.createdAt.toISOString()}', '${company.updatedAt.toISOString()}') ON CONFLICT (id) DO NOTHING;\n`
      })
      sqlScript += '\n'
    }
    
    // Insertar proyectos
    if (projects.length > 0) {
      sqlScript += '-- Proyectos\n'
      projects.forEach(project => {
        sqlScript += `INSERT INTO "Project" (id, name, description, "companyId", "userId", "createdAt", "updatedAt") VALUES ('${project.id}', '${project.name.replace(/'/g, "''")}', ${project.description ? `'${project.description.replace(/'/g, "''")}'` : 'NULL'}, '${project.companyId}', '${project.userId}', '${project.createdAt.toISOString()}', '${project.updatedAt.toISOString()}') ON CONFLICT (id) DO NOTHING;\n`
      })
      sqlScript += '\n'
    }
    
    // Insertar tareas
    if (tasks.length > 0) {
      sqlScript += '-- Tareas\n'
      tasks.forEach(task => {
        sqlScript += `INSERT INTO "Task" (id, title, description, completed, "dueDate", "companyId", "projectId", "userId", notes, "createdAt", "updatedAt") VALUES ('${task.id}', '${task.title.replace(/'/g, "''")}', ${task.description ? `'${task.description.replace(/'/g, "''")}'` : 'NULL'}, ${task.completed}, ${task.dueDate ? `'${task.dueDate.toISOString()}'` : 'NULL'}, ${task.companyId ? `'${task.companyId}'` : 'NULL'}, ${task.projectId ? `'${task.projectId}'` : 'NULL'}, '${task.userId}', ${task.notes ? `'${task.notes.replace(/'/g, "''")}'` : 'NULL'}, '${task.createdAt.toISOString()}', '${task.updatedAt.toISOString()}') ON CONFLICT (id) DO NOTHING;\n`
      })
    }
    
    fs.writeFileSync('data-import.sql', sqlScript)
    console.log('✅ Script SQL creado: data-import.sql')
    
  } catch (error) {
    console.error('❌ Error exportando datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportData()
