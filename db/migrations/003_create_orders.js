const { ObjectId } = require('mongodb');

module.exports.description =
  'Create orders collection with sample orders containing random products';

module.exports = async function (db) {
  await db.createCollection('orders');

  await db.collection('orders').createIndex({ createdAt: 1 }, { name: 'orders_created_at_idx' });

  const products = await db.collection('products').find({}).toArray();

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomProducts = count => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const orders = [];
  const orderStatuses = ['pending', 'processing', 'completed', 'cancelled'];

  for (let i = 0; i < 20; i++) {
    const productsCount = getRandomInt(2, 10);
    const orderProducts = getRandomProducts(productsCount);
    const quantity = getRandomInt(1, 3);

    const orderItems = orderProducts.map(product => {
      const price = product.price * quantity * getRandomInt(1, 3);
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        total: price.toFixed(2),
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => {
      return sum + Number(item.total);
    }, 0);

    const order = {
      orderNumber: `ORD-${String(i + 1).padStart(4, '0')}`,
      items: orderItems,
      totalAmount,
      status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };

    console.log('order', order);

    orders.push(order);
  }

  orders.sort((a, b) => a.createdAt - b.createdAt);

  await db.collection('orders').insertMany(orders);
};

module.exports.down = async function (db) {
  await db.collection('orders').dropIndex('orders_created_at_idx');

  await db.collection('orders').drop();
};
