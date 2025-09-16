#!/bin/bash

echo "🛑 Deteniendo TaskBook..."

# Matar todos los procesos de Node.js que estén usando el puerto 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚡ Liberando puerto 3000..."
    kill -9 $(lsof -t -i:3000) 2>/dev/null || true
    sleep 1
    echo "✅ TaskBook detenido correctamente"
else
    echo "ℹ️  TaskBook no estaba ejecutándose"
fi
