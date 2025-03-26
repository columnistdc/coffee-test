const { ObjectId } = require('mongodb');
module.exports.description = 'Add test users with different roles';

module.exports = async function (db) {
  const users = [
    {
      _id: new ObjectId('507f1f77bcf86cd799439011'),
      username: 'admin',
      email: 'admin@coffee-test.com',
      password: '$2b$10$YourHashedPasswordHere',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId('507f1f77bcf86cd799439012'),
      username: 'user1',
      email: 'user1@coffee-test.com',
      password: '$2b$10$YourHashedPasswordHere',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId('507f1f77bcf86cd799439013'),
      username: 'user2',
      email: 'user2@coffee-test.com',
      password: '$2b$10$YourHashedPasswordHere',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new ObjectId('507f1f77bcf86cd799439014'),
      username: 'observer',
      email: 'observer@coffee-test.com',
      password: '$2b$10$YourHashedPasswordHere',
      role: 'observer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.collection('users').insertMany(users);
};
