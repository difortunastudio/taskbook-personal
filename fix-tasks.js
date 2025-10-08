const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixTasks() {
  try {
    console.log('Actualizando tareas...')
    
    // Actualizar todas las tareas para asegurar que tengan deleted: false
    const result = await prisma.task.updateMany({
      data: {
        deleted: false
      }
    })
    
    console.log(`✅ Se actualizaron ${result.count} tareas`)
    
    // Verificar cuántas tareas tienes en total
    const totalTasks = await prisma.task.count()
    const activeTasks = await prisma.task.count({
      where: { deleted: false }
    })
    
    console.log(`📊 Total de tareas: ${totalTasks}`)
    console.log(`📊 Tareas activas: ${activeTasks}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixTasks()
