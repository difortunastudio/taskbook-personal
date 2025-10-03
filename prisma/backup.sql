-- Limpieza y adaptación para PostgreSQL/Neon
-- Eliminar transacciones SQLite y fragmentos incompatibles
-- backup.sql adaptado para PostgreSQL
-- Eliminados BEGIN/COMMIT, funciones SQLite, y ajustados tipos y sintaxis

-- USERS
CREATE TABLE IF NOT EXISTS "users" (
    "id" text PRIMARY KEY,
    "email" text NOT NULL,
    "password" text NOT NULL,
    "name" text,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL
);
INSERT INTO "users" ("id", "email", "password", "name", "createdAt", "updatedAt") VALUES
('cmf6z1jvs000axs9a2q27tavv','difortunastudio@gmail.com','$2b$12$sUakcW2OwfCI/SZ1tLfsQ.3bfx5LP69gVlrmhUuXmwQy8KiMZBrpu','Fiorella',now(),now()),
('cmf6z83x80000xsnb2cy0n5fh','fiorellagallodf@gmail.com','$2b$12$zeZwoPW9pZXhGXU5F3V.Du4AmCIB/9.dTLgIKnHz57Me/dBYCNEbu','Fiorella',now(),now());

-- COMPANIES
CREATE TABLE IF NOT EXISTS "companies" (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "email" text,
    "phone" text,
    "address" text,
    "cif" text,
    "accountNumber" text,
    "password" text,
    "notes" text,
    "color" text DEFAULT '#3B82F6',
    "userId" text NOT NULL,
    "updatedAt" timestamp NOT NULL,
    CONSTRAINT "companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "companies" ("id", "name", "email", "phone", "address", "cif", "accountNumber", "password", "notes", "color", "userId", "updatedAt") VALUES
('cmf6z8dnr0002xsnb6kygd19i','Rico Vidarte SL','rico.vidarte@gmail.com','','','B67326033','LT66 3250 0527 3756 2027','','Cuenta de banco REVOLUT €\nBIC : REVOLT21 (cuenta en euros)\n','#3B82F6','cmf6z83x80000xsnb2cy0n5fh',now()),
('cmf6zdb6v0006xsnbxj7f3pjr','Herokid SL','fiorella@herokidstudio.es','+34-933209090','Calle Joan d''Austria 95, 2º 3ª 08018 Barcelona España','B65374639','','','Instagram coworking - herokidcoworking@gmail.com Pass/ 2010@HerokidCoworking Meta\nR- 072010','#F59E0B','cmf6z83x80000xsnb2cy0n5fh',now()),
('cmf6zr6zn0003xsgfxq78gvpc','Fiorella Gallo Di Fortuna','difortunastudio@gmail.com','+34-665401359','Calle Joan d''Austria 95, 2º 3ª 08018 Barcelona','X4318310Z','','','','#84CC16','cmf6z83x80000xsnb2cy0n5fh',now()),
('cmfaw7btp0003xst2d7d2v7fq','Fliia SL','','','Calle Joan d''Austria 95, 2º 3, 08018 Barcelona España','','','','','#06B6D4','cmf6z83x80000xsnb2cy0n5fh',now()),
('cmfdvtcbp0009xsl2jbjwn3r5','FGD VII Group S.L.','difortunastudio@gmail.com','+34-665401359','Calle Joan d''Austria 95, 2º 3ª','','','','Crearé esta empresa.. despues de crear Fliia SL, y traspasaré Fliia a la holding FGD VII Group SL','#EC4899','cmf6z83x80000xsnb2cy0n5fh',now());

-- PROJECTS
CREATE TABLE IF NOT EXISTS "projects" (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "description" text,
    "companyId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL,
    CONSTRAINT "projects_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "projects" ("id", "name", "description", "companyId", "userId", "createdAt", "updatedAt") VALUES
('cmfaw3imr0001xst2tjm6lqp4','Etiketen','Reediseño de WEB etiketen.es \nincluir formulario para presupuestos rápidos','cmf6z8dnr0002xsnb6kygd19i','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmfawhgd60007xst2ttqklsh1','API Financiera HKST','Para cálculo de salario socios.','cmf6zdb6v0006xsnbxj7f3pjr','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmfdpirij0001xsfgkr3drvig','Beta Tester','probar app con usuarios "amigos" para luego obtener feedback','cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmfds21qe0001xsl220ir1149','Marketing Coworking','Hacer anuncios para promocionar coworking','cmf6zdb6v0006xsnbxj7f3pjr','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmfdv7rb50005xsl2uldoiaue','Volotea Empaquetado','Empaquetado de regalo para volotea ','cmf6z8dnr0002xsnb6kygd19i','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmfdvxhs4000bxsl2dpxc7xqs','Numa369','Numa369 es una app de numerología empresarial y personal diseñada para ayudarte a tomar decisiones alineadas con tu propósito, tu energía y tus ciclos vitales.\nTe permite conocer tus números clave y aplicarlos de forma práctica en áreas como:\nElección de fechas importantes (lanzamientos, firmas, reuniones)\nNombre de marcas o proyectos\nCompatibilidad de equipos\nCiclos personales y profesionales','cmfdvtcbp0009xsl2jbjwn3r5','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmfe4mojm0003xssdhai761ue','DoNothingClub','Un espacio y una filosofía para reconectar contigo mismo, sin estímulos, sin pantallas, sin presión.\n\n🌿 ¿Qué es?\n\nDoNothingPlan es una experiencia minimalista diseñada para que una sola persona, por turno, pueda desconectar profundamente del ruido externo y reconectar con su ser interior.\nUn refugio urbano donde "no hacer" es el plan.','cmfdvtcbp0009xsl2jbjwn3r5','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmfe4p09c0005xssd4bke6p8v','Planify APP','La app que organiza tus planes con amigos (¡sin caos de grupos de WhatsApp!)\nPlanify es una app pensada para centralizar toda la organización de planes sociales entre amigos (cenas, cumpleaños, escapadas, festivales, regalos, etc.) en un solo lugar, de forma estructurada, divertida y sin perder mensajes importantes entre memes.\n🧩 ¿Qué resuelve?\n\nEl caos de tener múltiples grupos de WhatsApp para cada plan.\nLa dificultad para coordinar fechas, lugares y decisiones grupales.\nLos líos con los pagos y regalos compartidos.\nLa falta de una herramienta que una organización, chat y finanzas personales en planes pequeños.','cmfdvtcbp0009xsl2jbjwn3r5','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmfe4rc4t0007xssdzccqs1yo','StyleDifortuna','Es tu proyecto personal de asesoría de imagen y moda, que combina tu experiencia en diseño con una visión estratégica más amplia.\n\nOrigen y Evolución\n\nEmpezó como tu marca de asesoría de imagen.\n\nAhora estás considerando relanzarla bajo el nombre Difortuna Studio, con una identidad más moderna, minimalista y alineada con tu estilo.\n\nForma parte del ecosistema de marcas que gestionas dentro de FGD VII Group S.L., tu holding familiar.\n\nServicios Actuales\n\nColorimetría (ya activa y funcionando bien, incluso sin promoción).\n\nAsesoría de imagen y estilo personal.\n\nConexión con tu experiencia en diseño de moda y la tradición de tu madre como modista.\n\nPropuesta de Valor\nPersonalización absoluta: cada persona recibe un enfoque único, no genérico.\nEstilo minimalista, cálido y texturizado (también reflejado en tu visión para el atelier).\nEnfoque humano y cercano: no solo moda, sino acompañamiento y autoconfianza.','cmf6z8dnr0002xsnb6kygd19i','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmffg6zjn000bxssd0dygchtl','1. Dirección & Estrategia',replace('Definir visión y objetivos del proyecto\n Diseñar hoja de ruta (MVP → Beta → Lanzamiento)\n Priorizar tareas semanales\n Documentar decisiones clave','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmffgno0g000dxssd8fsgtd20','2. Producto / Desarrollo',replace('Definir funcionalidades principales (activos, pasivos, tesorería, dashboard, etc.)\n Preparar wireframes / mockups\n Montar repositorio (GitHub + VS Code)\n Desarrollar MVP\n Testing interno y recogida de feedback\n Iteración y mejoras','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmffgos5d000fxssd8orrc33t','3. Diseño & Marca',replace('Crear manual de estilo (colores, tipografía, tono de comunicación)\n Diseñar logo y variaciones (app, redes, web)\n Diseñar interfaz de usuario (UI screens)\n Crear mockups para presentaciones y marketing','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmffgpupj000hxssd4946bo3l','4. Marketing & Comunicación',replace('Definir público objetivo\n Crear perfiles sociales (Instagram, LinkedIn, etc.)\n Elaborar calendario de publicaciones\n Generar posts educativos y de marca\n Crear página web / landing con registro de interesados\n Diseñar estrategia de Beta testers','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmffgqsv2000jxssd1qifr7ya','5. Legal & Seguridad',replace('Redactar textos legales (aviso legal, política de privacidad, cookies, términos de uso)\n Implementar cumplimiento RGPD (protección de datos y permisos)\n Diseñar medidas de seguridad en la app (roles de usuario, encriptación de datos sensibles)\n Registrar marca y nombre comercial','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmffgrtwk000lxssdeo147pmq','6. Finanzas',replace('Elaborar presupuesto inicial y controlar gastos\n Definir modelo de ingresos (suscripción, premium, etc.)\n Calcular precios\n Preparar plan de inversión (si necesitas socios o capital externo)\n Organizar contabilidad básica para futura SL','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmffgsnu4000nxssdod126k1d','7. Operaciones',replace('Elegir herramientas de trabajo (Notion, Trello, Airtable, etc.)\n Organizar tareas diarias/semanales\n Preparar checklist de pruebas antes del lanzamiento\n Gestionar feedback de usuarios y soporte inicial','\n',char(10)),'cmfaw7btp0003xst2d7d2v7fq','cmf6z83x80000xsnb2cy0n5fh',now(),now()),
('cmfmlsjdm0001xsembx49i3ja','Difortuna Estates','Aqui todo lo que tengo importante de hacer para DifortunaEstates','cmf6zr6zn0003xsgfxq78gvpc','cmf6z83x80000xsnb2cy0n5fh',now(),now());

-- TASKS
CREATE TABLE IF NOT EXISTS "tasks" (
    "id" text PRIMARY KEY,
    "title" text NOT NULL,
    "description" text,
    "completed" boolean NOT NULL DEFAULT false,
    "dueDate" timestamp,
    "companyId" text,
    "projectId" text,
    "userId" text NOT NULL,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL, notes text,
    CONSTRAINT "tasks_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "tasks" ("id", "title", "description", "completed", "dueDate", "companyId", "projectId", "userId", "createdAt", "updatedAt", notes) VALUES
('cmf6zaalr0004xsnb5wkbe9o4','agregar dinero a rico vidarte',NULL,true,NULL,NULL,NULL,'cmf6z83x80000xsnb2cy0n5fh',now(),now(),NULL),
('cmf6zeagl0008xsnb173a7rvc','terminar taskbook',NULL,true,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',now(),now(),NULL),
('cmf6zprac0001xsgf2qow7k36','Rellenar tarjetas de COBEE',NULL,false,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',now(),now(),NULL),
('cmfawbz5x0005xst20x4hug3a','Crear API financiera HKST',NULL,false,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',now(),now(),NULL),
('cmfdpnfum0003xsfg5lqp0dy0','Llamar a Securitas Direct','tienen que poner los sensores y las camaras.',false,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',now(),now(),NULL),
('cmfdpobio0005xsfgdtdsi6km','Revisar facturas Fort Pienc Fiore','mirar cuales están pagadas y cuales no',false,NULL,'cmf6zr6zn0003xsgfxq78gvpc',NULL,'cmf6z83x80000xsnb2cy0n5fh',now(),now(),NULL),
('cmfdpppvt0007xsfg1zybcbyv','Facturar a Onabitz','hacer factura mantenimiento por el mes de julio y agosto',true,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',now(),now(),E'Pasar precio de Mantenimiento Dirección Fiscal\nPrecio diario coworking (definir)\n\n\n[10/09/2025, 17:49]\nprobando'),
('cmfdprxhy0009xsfgy5ajdsmh','Crear empresa Fliia ','crear la SL, seré yo la administradora única pero debería estar dentro de un holding',false,CURRENT_TIMESTAMP,'cmfaw7btp0003xst2d7d2v7fq',NULL,'cmf6z83x80000xsnb2cy0n5fh',now(),now(),'pedir el nombre al registro'),
('cmfds33wq0003xsl20vbzf9ab','Anuncio marketing coworking','crear anuncio Instagram para coworking',true,CURRENT_TIMESTAMP,'cmf6zdb6v0006xsnbxj7f3pjr','cmfds21qe0001xsl220ir1149','cmf6z83x80000xsnb2cy0n5fh',now(),now(),NULL),
('cmfdv8pc90007xsl2tgnn7acx','Devolver chaleco Volotea','Devolver chaleco y a la espera de chaqueta para la última caja',false,NULL,'cmf6z8dnr0002xsnb6kygd19i','cmfdv7rb50005xsl2uldoiaue','cmf6z83x80000xsnb2cy0n5fh',now(),now(),'Ya están listas las cajas para ser enviadas a Volotea. Solo falta una.'),
('cmfdvz0hh000dxsl2wne72f7z','Revisar estado de Numa369','ahora está desplegada en Claude, pero hay que pasarla a VSC',false,NULL,'cmfdvtcbp0009xsl2jbjwn3r5','cmfdvxhs4000bxsl2dpxc7xqs','cmf6z83x80000xsnb2cy0n5fh',now(),now(),NULL),
('cmfegfdo70009xssd2hdp57ib','hacer papeles ','hadhafcaohas',true,NULL,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',now(),now(),NULL),
('cmffgxm1b000pxssdfgc4pu1a','Definir visión y objetivos del proyecto',E'“Convertirse en la herramienta de referencia para que las familias gestionen de manera clara, sencilla y colaborativa su patrimonio, deudas y economía familiar, fomentando la transparencia y la planificación conjunta.”\n🔹 Objetivos generales (3–5 años)\nDesarrollar un MVP funcional que resuelva la gestión de activos, pasivos y tesorería familiar.\nConseguir una primera comunidad de usuarios beta que validen la utilidad de la app.\nPosicionarse como la primera app de “balance familiar” en español (y más adelante multimoneda y multipaís).\nGenerar ingresos sostenibles a través de un modelo de suscripción accesible.\nEscalar la solución para incluir funciones avanzadas (herencias, patrimonio internacional, vinculación bancaria).\n🔹 Objetivos inmediatos (próximos 3–6 meses)\nCrear un prototipo navegable y comenzar el testeo con usuarios cercanos.\nEstablecer una identidad de marca clara y coherente (logo, colores, tono de comunicación).\nDefinir el modelo de precios inicial (ej. freemium + plan premium familiar).\nLanzar una landing page con lista de espera para captar interesados en la beta.\nRedactar un mini whitepaper/pitch sencillo para explicar el valor del proyecto.',false,NULL,'cmfaw7btp0003xst2d7d2v7fq','cmffg6zjn000bxssd0dygchtl','cmf6z83x80000xsnb2cy0n5fh',now(),now(),NULL),
('cmfmltbp20003xsemhxii7g70','Dossier Discoteca para Juan','Hacer dossier presentación para Juan',true,CURRENT_TIMESTAMP,'cmf6zr6zn0003xsgfxq78gvpc','cmfmlsjdm0001xsembx49i3ja','cmf6z83x80000xsnb2cy0n5fh',now(),now(),NULL),
('cmfwg5tmw0001xsozw8zcotaq','Nello',E'Dar de baja SS???\nholded dar de baja y descargar todos los informes.. pagar el ultimo recibo para que funcione.\nBaja médica hasta la proxima revisión el día 20/10/2025\nintercomarcal calle lepanto\n',false,CURRENT_TIMESTAMP,'cmf6zr6zn0003xsgfxq78gvpc',NULL,'cmf6z83x80000xsnb2cy0n5fh',now(),now(),NULL),
('cmfz6bgge0003xsozaqz7fdp9','Nóminas Septiembre ',E'revisar los extras de departamento. \naclarar que pasa cuando un departamento sale negativo',true,CURRENT_TIMESTAMP,'cmf6zdb6v0006xsnbxj7f3pjr',NULL,'cmf6z83x80000xsnb2cy0n5fh',now(),now(),NULL);

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

INSERT INTO memoria_contable VALUES('cmfe05h8o0001xssdauodka8x',CURRENT_TIMESTAMP,'Salarios Socios 2025','Hemos decidido pagar un salario fijo a cada socio que es de :\nDavid--> 4500€ Bruto/mes + Dietas 101€ + Bonus trrimestral (en función del remanente del dpto) + Dividendos.\nRobert--> 4000€ Bruto/mes + Dietas 108€ + Pagas extras (adm, jun/dic) Bonus trrimestral (en función del remanente del dpto) + Dividendos.\nJordi--> 4000€ Bruto/mes + Dietas 108€ + Pagas extras (jun/dic) Bonus trrimestral (en función del remanente del dpto) + Dividendos.\nFiorella--> 3000€ Bruto/mes + Dietas 108€ + Pagas extras (jun/dic) + Dividendos.\n\n\n\n','nota','Salario Anual HK','salarioshk','cmf6zdb6v0006xsnbxj7f3pjr','cmf6z83x80000xsnb2cy0n5fh',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Eliminar BEGIN TRANSACTION; y COMMIT;