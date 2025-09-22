#!/bin/bash

echo "🛠️  Configurando TaskBook para inicio automático..."

# Crear el archivo plist para LaunchAgent
PLIST_PATH="$HOME/Library/LaunchAgents/com.taskbook.app.plist"

cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.taskbook.app</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>$(pwd)/start.sh</string>
    </array>
    <key>WorkingDirectory</key>
    <string>$(pwd)</string>
    <key>RunAtLoad</key>
    <false/>
    <key>KeepAlive</key>
    <false/>
    <key>StandardOutPath</key>
    <string>$HOME/Library/Logs/taskbook.log</string>
    <key>StandardErrorPath</key>
    <string>$HOME/Library/Logs/taskbook-error.log</string>
</dict>
</plist>
EOF

echo "✅ Archivo de configuración creado en: $PLIST_PATH"
echo ""
echo "🎯 Para cargar el servicio, ejecuta:"
echo "   launchctl load $PLIST_PATH"
echo ""
echo "🛑 Para descargar el servicio, ejecuta:"
echo "   launchctl unload $PLIST_PATH"
echo ""
echo "📊 Para iniciar TaskBook manualmente:"
echo "   launchctl start com.taskbook.app"
