#!/usr/bin/env node
// Archivo de inicio personalizado para Next.js
const { execSync } = require('child_process');
const path = require('path');

// Asegurarse de que estamos en el directorio correcto
process.chdir(__dirname);

// Ejecutar Next.js
try {
  console.log('🚀 Iniciando TaskBook...');
  console.log('📁 Directorio:', process.cwd());
  
  const nextPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');
  console.log('📦 Ejecutando Next.js desde:', nextPath);
  
  // Usar spawn en lugar de execSync para procesos largos
  const { spawn } = require('child_process');
  const nextProcess = spawn('node', [nextPath, 'dev'], {
    stdio: 'inherit'
  });
  
  nextProcess.on('error', (err) => {
    console.error('❌ Error al ejecutar Next.js:', err);
  });
  
  nextProcess.on('close', (code) => {
    console.log(`🔚 Next.js terminó con código: ${code}`);
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
