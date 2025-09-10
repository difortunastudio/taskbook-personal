const { PrismaClient } = require('@prisma/client')

// Regenerar cliente para SQLite
process.env.DATABASE_URL = 'file:./dev.db'
const prismaLocal = new PrismaClient()

// Cliente para base de datos de producción (Neon)
const prismaProduction = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PRODUCTION_DATABASE_URL
    }
  }
})

async function syncToProduction() {
  try {
    console.log('🔄 Iniciando sincronización de datos local → producción...')

    // 1. Exportar usuarios
    console.log('📤 Exportando usuarios...')
    const users = await prismaLocal.user.findMany()
    
    for (const user of users) {
      await prismaProduction.user.upsert({
        where: { email: user.email },
        update: user,
        create: user
      })
    }
    console.log(`✅ ${users.length} usuarios sincronizados`)

    // 2. Exportar empresas
    console.log('📤 Exportando empresas...')
    const companies = await prismaLocal.company.findMany()
    
    for (const company of companies) {
      await prismaProduction.company.upsert({
        where: { id: company.id },
        update: company,
        create: company
      })
    }
    console.log(`✅ ${companies.length} empresas sincronizadas`)

    // 3. Exportar proyectos
    console.log('📤 Exportando proyectos...')
    const projects = await prismaLocal.project.findMany()
    
    for (const project of projects) {
      await prismaProduction.project.upsert({
        where: { id: project.id },
        update: project,
        create: project
      })
    }
    console.log(`✅ ${projects.length} proyectos sincronizados`)

    // 4. Exportar tareas
    console.log('📤 Exportando tareas...')
    const tasks = await prismaLocal.task.findMany()
    
    for (const task of tasks) {
      await prismaProduction.task.upsert({
        where: { id: task.id },
        update: task,
        create: task
      })
    }
    console.log(`✅ ${tasks.length} tareas sincronizadas`)

    // 5. Exportar enlaces
    console.log('📤 Exportando enlaces...')
    const links = await prismaLocal.link.findMany()
    
    for (const link of links) {
      await prismaProduction.link.upsert({
        where: { id: link.id },
        update: link,
        create: link
      })
    }
    console.log(`✅ ${links.length} enlaces sincronizados`)

    // 6. Exportar archivos
    console.log('📤 Exportando archivos...')
    const files = await prismaLocal.file.findMany()
    
    for (const file of files) {
      await prismaProduction.file.upsert({
        where: { id: file.id },
        update: file,
        create: file
      })
    }
    console.log(`✅ ${files.length} archivos sincronizados`)

    console.log('🎉 ¡Sincronización completada exitosamente!')
    
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error)
  } finally {
    await prismaLocal.$disconnect()
    await prismaProduction.$disconnect()
  }
}

syncToProduction()
