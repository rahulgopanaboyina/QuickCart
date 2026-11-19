'use strict';

class Product {
  constructor(id, name, price, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  getTotalPrice() {
    return this.price * this.quantity;
  }
}

const customer = { name: 'Rahul', email: 'rahul@gmail.com' };
const products = [
  new Product(1, 'Laptop', 50000, 1),
  new Product(2, 'Mouse', 1000, 2),
  new Product(3, 'Monitor', 15000, 1),
  new Product(4, 'Keyboard', 2000, 1),
];

const orderConfiguration = Object.freeze({ currency: 'INR', status: 'Processing' });

function buildOrderSummary() {
  const { name: customerName, email } = customer;
  const productTotals = products.map(({ name, price, quantity }) => ({
    name,
    total: price * quantity,
  }));
  const productsAbove5000 = products.filter((product) => product.getTotalPrice() > 5000);
  const orderTotal = products.reduce((total, product) => total + product.getTotalPrice(), 0);
  const uniqueProductIds = new Set(products.map((product) => product.id));
  const inventory = new Map(products.map((product) => [product.id, {
    name: product.name,
    availableQuantity: product.quantity,
  }]));

  const order = {
    customer: { name: customerName, email },
    products: productTotals,
    productsAbove5000: productsAbove5000.map((product) => product.name),
    total: orderTotal,
    uniqueProductIds: [...uniqueProductIds],
    inventory: [...inventory.entries()],
    configuration: orderConfiguration,
    status: orderConfiguration.status,
  };

  return {
    customerName,
    productTotals,
    productsAbove5000,
    orderTotal,
    uniqueProductIds,
    inventory,
    order,
    serializedOrder: JSON.stringify(order, null, 2),
  };
}

async function confirmOrder() {
  try {
    console.log('Order Status: Processing...');
    await Promise.resolve();
    console.log('Order Status: Confirmed Successfully!');
    return { success: true, status: 'Confirmed Successfully!' };
  } catch (error) {
    console.error('Order confirmation failed:', error.message);
    return { success: false, status: error.message };
  }
}

async function runQuickCartIntegration() {
  const summary = buildOrderSummary();
  const productLines = summary.productTotals
    .map(({ name, total }) => `${name.padEnd(12)} - ₹${total}`)
    .join('\n');

  console.log('====== QUICKCART ORDER SUMMARY ======');
  console.log(`Customer: ${summary.customerName}`);
  console.log('Products:');
  console.log(productLines);
  console.log(`Total Order Amount: ₹${summary.orderTotal}`);
  console.log(`Unique Products: ${summary.uniqueProductIds.size}`);
  await confirmOrder();
  console.log('=====================================');
  console.log('\nSerialized order:');
  console.log(summary.serializedOrder);
  return summary;
}

if (require.main === module) {
  runQuickCartIntegration().catch((error) => {
    console.error('QuickCart integration failed:', error);
    process.exitCode = 1;
  });
}

module.exports = { Product, customer, products, orderConfiguration, buildOrderSummary, confirmOrder, runQuickCartIntegration };
