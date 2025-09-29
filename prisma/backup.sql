BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);
INSERT INTO users VALUES('cmf6z1jvs000axs9a2q27tavv','difortunastudio@gmail.com','$2b$12$sUakcW2OwfCI/SZ1tLfsQ.3bfx5LP69gVlrmhUuXmwQy8KiMZBrpu','Fiorella',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO users VALUES('cmf6z83x80000xsnb2cy0n5fh','fiorellagallodf@gmail.com','$2b$12$zeZwoPW9pZXhGXU5F3V.Du4AmCIB/9.dTLgIKnHz57Me/dBYCNEbu','Fiorella',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS "companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "cif" TEXT,
    "accountNumber" TEXT,
    "password" TEXT,
    "notes" TEXT,
    "color" TEXT DEFAULT '#3B82F6',
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO companies VALUES('cmf6z8dnr0002xsnb6kygd19i','Rico Vidarte SL','rico.vidarte@gmail.com','','','B67326033','LT66 3250 0527 3756 2027','',replace('Cuenta de banco REVOLUT €\nBIC : REVOLT21 (cuenta en euros)\n','\n',char(10)),'#3B82F6','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP);
INSERT INTO companies VALUES('cmf6zdb6v0006xsnbxj7f3pjr','Herokid SL','fiorella@herokidstudio.es','+34-933209090','Calle Joan d''Austria 95, 2º 3ª 08018 Barcelona España','B65374639','','',replace('Instagram coworking - herokidcoworking@gmail.com Pass/ 2010@HerokidCoworking Meta\nR- 072010','\n',char(10)),'#F59E0B','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP);
INSERT INTO companies VALUES('cmf6zr6zn0003xsgfxq78gvpc','Fiorella Gallo Di Fortuna','difortunastudio@gmail.com','+34-665401359','Calle Joan d''Austria 95, 2º 3ª 08018 Barcelona','X4318310Z','','','','#84CC16','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP);
INSERT INTO companies VALUES('cmfaw7btp0003xst2d7d2v7fq','Fliia SL','','','Calle Joan d''Austria 95, 2º 3, 08018 Barcelona España','','','','','#06B6D4','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP);
INSERT INTO companies VALUES('cmfdvtcbp0009xsl2jbjwn3r5','FGD VII Group S.L.','difortunastudio@gmail.com','+34-665401359','Calle Joan d''Austria 95, 2º 3ª','','','','Crearé esta empresa.. despues de crear Fliia SL, y traspasaré Fliia a la holding FGD VII Group SL','#EC4899','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "projects_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO projects VALUES('cmfaw3imr0001xst2tjm6lqp4','Etiketen',replace('Reediseño de WEB etiketen.es \nincluir formulario para presupuestos rápidos','\n',char(10)),'cmf6z8dnr0002xsnb6kygd19i','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmfawhgd60007xst2ttqklsh1','API Financiera HKST','Para cálculo de salario socios.','cmf6zdb6v0006xsnbxj7f3pjr','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmfdpirij0001xsfgkr3drvig','Beta Tester','probar app con usuarios "amigos" para luego obtener feedback','cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmfds21qe0001xsl220ir1149','Marketing Coworking','Hacer anuncios para promocionar coworking','cmf6zdb6v0006xsnbxj7f3pjr','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmfdv7rb50005xsl2uldoiaue','Volotea Empaquetado','Empaquetado de regalo para volotea ','cmf6z8dnr0002xsnb6kygd19i','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmfdvxhs4000bxsl2dpxc7xqs','Numa369',replace('Numa369 es una app de numerología empresarial y personal diseñada para ayudarte a tomar decisiones alineadas con tu propósito, tu energía y tus ciclos vitales.\nTe permite conocer tus números clave y aplicarlos de forma práctica en áreas como:\nElección de fechas importantes (lanzamientos, firmas, reuniones)\nNombre de marcas o proyectos\nCompatibilidad de equipos\nCiclos personales y profesionales','\n',char(10)),'cmfdvtcbp0009xsl2jbjwn3r5','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmfe4mojm0003xssdhai761ue','DoNothingClub',replace('Un espacio y una filosofía para reconectar contigo mismo, sin estímulos, sin pantallas, sin presión.\n\n🌿 ¿Qué es?\n\nDoNothingPlan es una experiencia minimalista diseñada para que una sola persona, por turno, pueda desconectar profundamente del ruido externo y reconectar con su ser interior.\nUn refugio urbano donde "no hacer" es el plan.','\n',char(10)),'cmfdvtcbp0009xsl2jbjwn3r5','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmfe4p09c0005xssd4bke6p8v','Planify APP',replace('La app que organiza tus planes con amigos (¡sin caos de grupos de WhatsApp!)\nPlanify es una app pensada para centralizar toda la organización de planes sociales entre amigos (cenas, cumpleaños, escapadas, festivales, regalos, etc.) en un solo lugar, de forma estructurada, divertida y sin perder mensajes importantes entre memes.\n🧩 ¿Qué resuelve?\n\nEl caos de tener múltiples grupos de WhatsApp para cada plan.\nLa dificultad para coordinar fechas, lugares y decisiones grupales.\nLos líos con los pagos y regalos compartidos.\nLa falta de una herramienta que una organización, chat y finanzas personales en planes pequeños.\n','\n',char(10)),'cmfdvtcbp0009xsl2jbjwn3r5','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmfe4rc4t0007xssdzccqs1yo','StyleDifortuna',replace('Es tu proyecto personal de asesoría de imagen y moda, que combina tu experiencia en diseño con una visión estratégica más amplia.\n\nOrigen y Evolución\n\nEmpezó como tu marca de asesoría de imagen.\n\nAhora estás considerando relanzarla bajo el nombre Difortuna Studio, con una identidad más moderna, minimalista y alineada con tu estilo.\n\nForma parte del ecosistema de marcas que gestionas dentro de FGD VII Group S.L., tu holding familiar.\n\nServicios Actuales\n\nColorimetría (ya activa y funcionando bien, incluso sin promoción).\n\nAsesoría de imagen y estilo personal.\n\nConexión con tu experiencia en diseño de moda y la tradición de tu madre como modista.\n\nPropuesta de Valor\nPersonalización absoluta: cada persona recibe un enfoque único, no genérico.\nEstilo minimalista, cálido y texturizado (también reflejado en tu visión para el atelier).\nEnfoque humano y cercano: no solo moda, sino acompañamiento y autoconfianza.','\n',char(10)),'cmf6z8dnr0002xsnb6kygd19i','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmffg6zjn000bxssd0dygchtl','1. Dirección & Estrategia',replace('Definir visión y objetivos del proyecto\n Diseñar hoja de ruta (MVP → Beta → Lanzamiento)\n Priorizar tareas semanales\n Documentar decisiones clave','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmffgno0g000dxssd8fsgtd20','2. Producto / Desarrollo',replace('Definir funcionalidades principales (activos, pasivos, tesorería, dashboard, etc.)\n Preparar wireframes / mockups\n Montar repositorio (GitHub + VS Code)\n Desarrollar MVP\n Testing interno y recogida de feedback\n Iteración y mejoras','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmffgos5d000fxssd8orrc33t','3. Diseño & Marca',replace('Crear manual de estilo (colores, tipografía, tono de comunicación)\n Diseñar logo y variaciones (app, redes, web)\n Diseñar interfaz de usuario (UI screens)\n Crear mockups para presentaciones y marketing','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmffgpupj000hxssd4946bo3l','4. Marketing & Comunicación',replace('Definir público objetivo\n Crear perfiles sociales (Instagram, LinkedIn, etc.)\n Elaborar calendario de publicaciones\n Generar posts educativos y de marca\n Crear página web / landing con registro de interesados\n Diseñar estrategia de Beta testers','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmffgqsv2000jxssd1qifr7ya','5. Legal & Seguridad',replace('Redactar textos legales (aviso legal, política de privacidad, cookies, términos de uso)\n Implementar cumplimiento RGPD (protección de datos y permisos)\n Diseñar medidas de seguridad en la app (roles de usuario, encriptación de datos sensibles)\n Registrar marca y nombre comercial','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmffgrtwk000lxssdeo147pmq','6. Finanzas',replace('Elaborar presupuesto inicial y controlar gastos\n Definir modelo de ingresos (suscripción, premium, etc.)\n Calcular precios\n Preparar plan de inversión (si necesitas socios o capital externo)\n Organizar contabilidad básica para futura SL','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmffgsnu4000nxssdod126k1d','7. Operaciones',replace('Elegir herramientas de trabajo (Notion, Trello, Airtable, etc.)\n Organizar tareas diarias/semanales\n Preparar checklist de pruebas antes del lanzamiento\n Gestionar feedback de usuarios y soporte inicial','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO projects VALUES('cmfmlsjdm0001xsembx49i3ja','Difortuna Estates','Aqui todo lo que tengo importante de hacer para DifortunaEstates','cmf6zr6zn0003xsgfxq78gvpc','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TIMESTAMP,
    "companyId" TEXT,
    "projectId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL, "notes" TEXT,
    CONSTRAINT "tasks_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO tasks VALUES('cmf6zaalr0004xsnb5wkbe9o4','agregar dinero a rico vidarte',NULL,1,NULL,NULL,NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmf6zeagl0008xsnb173a7rvc','terminar taskbook',NULL,1,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmf6zprac0001xsgf2qow7k36','Rellenar tarjetas de COBEE',NULL,0,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmfawbz5x0005xst20x4hug3a','Crear API financiera HKST',NULL,0,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmfdpnfum0003xsfg5lqp0dy0','Llamar a Securitas Direct','tienen que poner los sensores y las camaras.',0,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmfdpobio0005xsfgdtdsi6km','Revisar facturas Fort Pienc Fiore','mirar cuales están pagadas y cuales no',0,NULL,'cmf6zr6zn0003xsgfxq78gvpc',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmfdpppvt0007xsfg1zybcbyv','Facturar a Onabitz','hacer factura mantenimiento por el mes de julio y agosto',1,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,replace('Pasar precio de Mantenimiento Dirección Fiscal\nPrecio diario coworking (definir)\n\n\n[10/09/2025, 17:49]\nprobando','\n',char(10)));
INSERT INTO tasks VALUES('cmfdprxhy0009xsfgy5ajdsmh','Crear empresa Fliia ','crear la SL, seré yo la administradora única pero debería estar dentro de un holding',0,CURRENT_TIMESTAMP,'cmfaw7btp0003xst2d7d2v7fq',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'pedir el nombre al registro');
INSERT INTO tasks VALUES('cmfds33wq0003xsl20vbzf9ab','Anuncio marketing coworking','crear anuncio Instagram para coworking',1,CURRENT_TIMESTAMP,'cmf6zdb6v0006xsnbxj7f3pjr','cmfds21qe0001xsl220ir1149','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmfdv8pc90007xsl2tgnn7acx','Devolver chaleco Volotea','Devolver chaleco y a la espera de chaqueta para la última caja',0,NULL,'cmf6z8dnr0002xsnb6kygd19i','cmfdv7rb50005xsl2uldoiaue','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Ya están listas las cajas para ser enviadas a Volotea. Solo falta una.');
INSERT INTO tasks VALUES('cmfdvz0hh000dxsl2wne72f7z','Revisar estado de Numa369','ahora está desplegada en Claude, pero hay que pasarla a VSC',0,NULL,'cmfdvtcbp0009xsl2jbjwn3r5','cmfdvxhs4000bxsl2dpxc7xqs','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmfegfdo70009xssd2hdp57ib','hacer papeles ','hadhafcaohas',1,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmffgxm1b000pxssdfgc4pu1a','Definir visión y objetivos del proyecto',replace('“Convertirse en la herramienta de referencia para que las familias gestionen de manera clara, sencilla y colaborativa su patrimonio, deudas y economía familiar, fomentando la transparencia y la planificación conjunta.”\n🔹 Objetivos generales (3–5 años)\nDesarrollar un MVP funcional que resuelva la gestión de activos, pasivos y tesorería familiar.\nConseguir una primera comunidad de usuarios beta que validen la utilidad de la app.\nPosicionarse como la primera app de “balance familiar” en español (y más adelante multimoneda y multipaís).\nGenerar ingresos sostenibles a través de un modelo de suscripción accesible.\nEscalar la solución para incluir funciones avanzadas (herencias, patrimonio internacional, vinculación bancaria).\n🔹 Objetivos inmediatos (próximos 3–6 meses)\nCrear un prototipo navegable y comenzar el testeo con usuarios cercanos.\nEstablecer una identidad de marca clara y coherente (logo, colores, tono de comunicación).\nDefinir el modelo de precios inicial (ej. freemium + plan premium familiar).\nLanzar una landing page con lista de espera para captar interesados en la beta.\nRedactar un mini whitepaper/pitch sencillo para explicar el valor del proyecto.','\n',char(10)),0,NULL,'cmfaw7btp0003xst2d7d2v7fq','cmffg6zjn000bxssd0dygchtl','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmfmltbp20003xsemhxii7g70','Dossier Discoteca para Juan','Hacer dossier presentación para Juan',1,CURRENT_TIMESTAMP,'cmf6zr6zn0003xsgfxq78gvpc','cmfmlsjdm0001xsembx49i3ja','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmfwg5tmw0001xsozw8zcotaq','Nello',replace('Dar de baja SS???\nholded dar de baja y descargar todos los informes.. pagar el ultimo recibo para que funcione.\nBaja médica hasta la proxima revisión el día 20/10/2025\nintercomarcal calle lepanto\n','\n',char(10)),0,CURRENT_TIMESTAMP,'cmf6zr6zn0003xsgfxq78gvpc',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmfz6bgge0003xsozaqz7fdp9','Nóminas Septiembre ',replace('revisar los extras de departamento. \naclarar que pasa cuando un departamento sale negativo','\n',char(10)),1,CURRENT_TIMESTAMP,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmfz807a70005xsozbn8ygi6j','Facturas Volotea','Pedir horas a David y Robert',0,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmg167a480001xsdcr31r52qp','terminar NUma369','',0,NULL,'cmf6z8dnr0002xsnb6kygd19i',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmg4v1n320001xs4s703zsfd5','Alarma Securitas','Revisar todas las alarmas, conectar los sensores de humo',0,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,replace('[29/09/2025, 11:59]\nno se han conectado los detectores de humo porque faltan los aparatos.\nconseguir todas las llaves y volver a grabarlas correctamente, llamando al técnico','\n',char(10)));
INSERT INTO tasks VALUES('cmg4vguhz0003xs4s6qxtls75','Actualizar Tabla activos supabase',replace('no me esta reconociendo parate de la tabla en supabase. \nvolver a chequear','\n',char(10)),0,NULL,'cmfaw7btp0003xst2d7d2v7fq',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);
INSERT INTO tasks VALUES('cmg4vktb50005xs4szolfv5nd','Alquier Sala Reuniones','Alquiler sala de reuniones a las 10:30 Guillem marcar luego la hora de salida para facturar.',0,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,replace('[29/09/2025, 11:32]\nterminan a las 11:30 total 1 hora','\n',char(10)));
CREATE TABLE IF NOT EXISTS "files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "companyId" TEXT,
    "projectId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "files_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "files_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "companyId" TEXT,
    "projectId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "links_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "links_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "memoria_contable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TIMESTAMP NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reference" TEXT,
    "tags" TEXT,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "memoria_contable_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "memoria_contable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO memoria_contable VALUES('cmfe05h8o0001xssdauodka8x',CURRENT_TIMESTAMP,'Salarios Socios 2025',replace('Hemos decidido pagar un salario fijo a cada socio que es de :\nDavid--> 4500€ Bruto/mes + Dietas 101€ + Bonus trrimestral (en función del remanente del dpto) + Dividendos.\nRobert--> 4000€ Bruto/mes + Dietas 108€ + Pagas extras (adm, jun/dic) Bonus trrimestral (en función del remanente del dpto) + Dividendos.\nJordi--> 4000€ Bruto/mes + Dietas 108€ + Pagas extras (jun/dic) Bonus trrimestral (en función del remanente del dpto) + Dividendos.\nFiorella--> 3000€ Bruto/mes + Dietas 108€ + Pagas extras (jun/dic) + Dividendos.\n\n\n\n','\n',char(10)),'nota','Salario Anual HK','salarioshk','cmf6zdb6v0006xsnbxj7f3pjr','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
COMMIT;
