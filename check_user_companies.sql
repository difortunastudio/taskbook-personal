SELECT u.id, u.email, COUNT(c.id) as company_count FROM users u LEFT JOIN companies c ON u.id = c."userId" GROUP BY u.id, u.email ORDER BY company_count DESC;
