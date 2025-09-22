#!/bin/bash

echo "🚀 Iniciando TaskBook..."

# Verificar si está en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json"
    echo "   Asegúrate de estar en el directorio correcto"
    exit 1
fi

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar si el puerto 3000 está ocupado
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  El puerto 3000 está ocupado. Liberando..."
    kill -9 $(lsof -t -i:3000) 2>/dev/null || true
    sleep 2
fi

echo "🌟 Iniciando servidor de desarrollo..."
echo "📱 La aplicación estará disponible en: http://localhost:3000"
echo "🏠 Dashboard: http://localhost:3000/home"
echo "📅 Mi Día: http://localhost:3000/today"
echo ""
echo "Para detener el servidor, presiona Ctrl+C"
echo ""

# Función para abrir el navegador después de que el servidor esté listo
open_browser() {
    sleep 3  # Esperar 3 segundos para que el servidor inicie
    echo "🚀 Abriendo TaskBook en tu navegador..."
    open "http://localhost:3000/home"
}

# Ejecutar la función en segundo plano
open_browser &

# Iniciar el servidor
npm run dev
