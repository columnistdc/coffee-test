const { MongoClient } = require('mongodb');
const { DB_URL } = require('./constants');

async function checkMigrations() {
  const client = await MongoClient.connect(DB_URL);
  const db = client.db('coffee_test');

  try {
    const collections = await db.listCollections().toArray();
    console.log('\nCollections in database:');
    collections.forEach(col => console.log(`- ${col.name}`));

    const categories = await db.collection('categories').find({}).toArray();
    console.log('\nCategories:');
    console.log(`Total categories: ${categories.length}`);
    console.log('Categories list:');
    categories.forEach(cat => console.log(`- ${cat.name}`));

    const products = await db.collection('products').find({}).toArray();
    console.log('\nProducts:');
    console.log(`Total products: ${products.length}`);
    console.log('Products list:');
    products.forEach(prod => console.log(`- ${prod.name} (${prod.price} rub.)`));

    const orders = await db.collection('orders').find({}).toArray();
    console.log('\nOrders:');
    console.log(`Total orders: ${orders.length}`);
    console.log('Orders statistics:');
    orders.forEach(order => {
      console.log(`- Order #${order._id}:`);
      console.log(`  Status: ${order.status}`);
      console.log(`  Amount: ${order.totalAmount} rub.`);
      console.log(`  Items: ${order.items.length} pcs.`);
    });

    const users = await db.collection('users').find({}).toArray();
    console.log('\nUsers:');
    console.log(`Total users: ${users.length}`);
    console.log('Users list:');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email})`);
      console.log(`  Role: ${user.role}`);
    });

    const migrations = await db.collection('migrations').find({}).toArray();
    console.log('\nMigrations:');
    console.log(`Total applied migrations: ${migrations.length}`);
    console.log('Migrations list:');
    migrations.forEach(migration => {
      console.log(`- ${migration.name}`);
      console.log(`  Applied at: ${migration.appliedAt}`);
    });

    const categoriesCount = await db.collection('categories').countDocuments();
    console.log('\n=== Categories ===');
    console.log(`Total categories: ${categoriesCount}`);
    const categoriesByProduct = await db
      .collection('products')
      .aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $group: {
            _id: { $arrayElemAt: ['$category.name', 0] },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    console.log('\nProducts by category:');
    categoriesByProduct.forEach(({ _id, count }) => {
      console.log(`- ${_id}: ${count} products`);
    });

    const productsCount = await db.collection('products').countDocuments();
    console.log('\n=== Products ===');
    console.log(`Total products: ${productsCount}`);

    const ordersCount = await db.collection('orders').countDocuments();
    console.log('\n=== Orders ===');
    console.log(`Total orders: ${ordersCount}`);

    const ordersStats = await db
      .collection('orders')
      .aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $avg: '$totalAmount' },
          },
        },
      ])
      .toArray();

    console.log('\nOrders statistics:');
    console.log('Status: Count: Average amount:', ordersStats);
    ordersStats.forEach(({ _id, count, totalAmount }) => {
      console.log(`\nStatus: ${_id}`);
      console.log(`Count: ${count}`);
      console.log(`Average amount: ${totalAmount.toFixed(2)}`);
    });

    const lastOrders = await db
      .collection('orders')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    console.log('\nLast 5 orders:');
    lastOrders.forEach(order => {
      console.log(`\nOrder ${order.orderNumber}:`);
      console.log(`Date: ${order.createdAt.toLocaleString()}`);
      console.log(`Status: ${order.status}`);
      console.log(`Amount: ${order.totalAmount.toFixed(2)}`);
      console.log('Products:');
      order.items.forEach(item => {
        console.log(`- ${item.name} (${item.quantity} pcs. x ${item.price} = ${item.total})`);
      });
    });
  } catch (error) {
    console.error('Error checking migrations:', error);
  } finally {
    await client.close();
  }
}

checkMigrations().catch(console.error);
