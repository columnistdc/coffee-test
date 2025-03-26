module.exports.description = 'Create categories collection with required fields and indexes';

module.exports = async function (db) {
  await db.createCollection('categories');

  await db
    .collection('categories')
    .createIndex({ name: 1 }, { unique: true, name: 'categories_name_unique' });

  await db
    .collection('categories')
    .createIndex({ slug: 1 }, { unique: true, name: 'categories_slug_unique' });

  const defaultCategories = [
    {
      name: 'Молочные продукты',
      slug: 'dairy-products',
      description: 'Молоко, сыр, йогурт и другие молочные продукты',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Хлебобулочные изделия',
      slug: 'bakery',
      description: 'Хлеб, булочки, выпечка',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Овощи и фрукты',
      slug: 'fruits-and-vegetables',
      description: 'Свежие овощи и фрукты',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Мясо и птица',
      slug: 'meat-and-poultry',
      description: 'Мясо, курица, индейка и другие мясные продукты',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Рыба и морепродукты',
      slug: 'fish-and-seafood',
      description: 'Рыба, креветки, мидии и другие морепродукты',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Кондитерские изделия',
      slug: 'confectionery',
      description: 'Сладости, шоколад, конфеты',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Бакалея',
      slug: 'grocery',
      description: 'Крупы, макароны, консервы',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Напитки',
      slug: 'beverages',
      description: 'Соки, вода, газированные напитки',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Алкогольные напитки',
      slug: 'alcoholic-beverages',
      description: 'Вино, пиво, крепкие напитки',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Замороженные продукты',
      slug: 'frozen-foods',
      description: 'Замороженные овощи, мясо, полуфабрикаты',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Соусы и специи',
      slug: 'sauces-and-spices',
      description: 'Соусы, приправы, специи',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Орехи и сухофрукты',
      slug: 'nuts-and-dried-fruits',
      description: 'Орехи, сухофрукты, семечки',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Детское питание',
      slug: 'baby-food',
      description: 'Питание для детей',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Диетические продукты',
      slug: 'dietary-products',
      description: 'Продукты для диетического питания',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Фастфуд и полуфабрикаты',
      slug: 'fast-food-and-semi-finished',
      description: 'Готовые блюда и полуфабрикаты',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.collection('categories').insertMany(defaultCategories);
};

module.exports.down = async function (db) {
  await db.collection('categories').dropIndex('categories_name_unique');
  await db.collection('categories').dropIndex('categories_slug_unique');

  await db.collection('categories').drop();
};
