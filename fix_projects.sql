UPDATE projects SET "userId" = (SELECT id FROM users WHERE email = 'fiorellagallodf@gmail.com') WHERE "userId" = 'cmf6z83x80000xsnb2cy0n5fh';
