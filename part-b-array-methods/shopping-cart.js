'use strict';

const cart = [
  { id: 101, name: 'Laptop', price: 50000, quantity: 1, category: 'Electronics' },
  { id: 102, name: 'Mouse', price: 800, quantity: 2, category: 'Accessories' },
  { id: 103, name: 'Keyboard', price: 1500, quantity: 1, category: 'Accessories' },
  { id: 104, name: 'Monitor', price: 12000, quantity: 1, category: 'Electronics' },
  { id: 105, name: 'Headphones', price: 2500, quantity: 2, category: 'Accessories' },
];

function calculateCartDetails(items = cart) {
  const itemTotals = items.map(({ name, price, quantity }) => ({
    name,
    totalItemPrice: price * quantity,
  }));
  const productsAbove2000 = items.filter((product) => product.price > 2000);
  const totalCartValue = items.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );
  const electronicsTotal = items
    .filter((product) => product.category === 'Electronics')
    .reduce((total, product) => total + product.price * product.quantity, 0);

  return { itemTotals, productsAbove2000, totalCartValue, electronicsTotal };
}

function createInventory(items = cart) {
  const inventory = new Map(items.map((product) => [product.id, { ...product }]));
  return inventory;
}

function demonstrateMapOperations(inventory) {
  const selectedProduct = inventory.get(101);
  if (selectedProduct) {
    selectedProduct.quantity += 1;
    inventory.set(101, selectedProduct);
  }

  inventory.delete(103);
  const entries = [...inventory.entries()];
  return { selectedProduct, entries };
}

function removeDuplicateEmails(emails) {
  return [...new Set(emails)];
}

function demonstrateFreezeAndSeal() {
  const productConfig = { name: 'Laptop', price: 50000, stock: 20 };
  const frozenConfig = Object.freeze({ ...productConfig });
  const sealedConfig = Object.seal({ ...productConfig });

  // Reflect operations return false instead of throwing when a property
  // cannot be changed in this non-strict demonstration context.
  const frozenOperations = {
    priceChanged: Reflect.set(frozenConfig, 'price', 45000),
    propertyAdded: Reflect.set(frozenConfig, 'brand', 'Acme'),
    propertyDeleted: Reflect.deleteProperty(frozenConfig, 'stock'),
  };
  const sealedOperations = {
    priceChanged: Reflect.set(sealedConfig, 'price', 45000),
    propertyAdded: Reflect.set(sealedConfig, 'brand', 'Acme'),
    propertyDeleted: Reflect.deleteProperty(sealedConfig, 'stock'),
  };

  return { frozenConfig, sealedConfig, frozenOperations, sealedOperations };
}

function runDemonstration() {
  console.log('--- Part B: Array Methods, Map & Set ---');
  const details = calculateCartDetails();
  console.log('Names with total item price:', details.itemTotals);
  console.log('Products above ₹2,000:', details.productsAbove2000);
  console.log('Total cart value:', details.totalCartValue);
  console.log('Electronics total:', details.electronicsTotal);
  cart.forEach(({ name, category, quantity }) => console.log(name, category, quantity));

  const inventory = createInventory();
  const mapResult = demonstrateMapOperations(inventory);
  console.log('Product with ID 101:', mapResult.selectedProduct);
  console.log('Updated inventory entries:', mapResult.entries);
  console.log('Unique emails:', removeDuplicateEmails([
    'rahul@gmail.com', 'priya@gmail.com', 'rahul@gmail.com',
    'arjun@gmail.com', 'priya@gmail.com',
  ]));
  console.log('Freeze vs seal:', demonstrateFreezeAndSeal());
}

if (require.main === module) runDemonstration();

module.exports = {
  cart,
  calculateCartDetails,
  createInventory,
  demonstrateMapOperations,
  removeDuplicateEmails,
  demonstrateFreezeAndSeal,
};
