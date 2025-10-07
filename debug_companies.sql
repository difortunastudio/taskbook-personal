SELECT c.name, c."userId", u.email FROM companies c LEFT JOIN users u ON c."userId" = u.id LIMIT 5;
