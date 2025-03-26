db = db.getSiblingDB('admin');

if (!db.getUser('admin')) {
  db.createUser({
    user: 'admin',
    pwd: 'admin123',
    roles: [
      {
        role: 'root',
        db: 'admin',
      },
    ],
  });
}
