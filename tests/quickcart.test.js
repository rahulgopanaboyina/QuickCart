'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const partA = require('../part-a-objects-classes/products');
const partB = require('../part-b-array-methods/shopping-cart');
const partC = require('../part-c-json-debugging/json-handling');
const partD = require('../part-d-asynchronous/order-processing');
const partE = require('../part-e-optimization-events/script');
const partF = require('../part-f-integration/quickcart');

// Part A
test('Part A: prototype products share displayProduct through their prototype', () => {
  const [first, second] = partA.prototypeProducts.products;
  assert.equal(first.displayProduct(), 'Laptop - ₹50000 (Electronics)');
  assert.equal(Object.hasOwn(first, 'displayProduct'), false);
  assert.equal(first.displayProduct, second.displayProduct);
});

test('Part A: ES6 subclasses inherit details and expose their unique methods', () => {
  const electronic = new partA.classProducts.ElectronicProduct('Laptop', 50000, 2);
  const clothing = new partA.classProducts.ClothingProduct('Jacket', 3000, 'M');
  assert.equal(electronic.getProductDetails(), 'Laptop - ₹50000 (Electronics)');
  assert.equal(electronic.getWarrantyDetails(), '2-year warranty');
  assert.equal(clothing.getSizeDetails(), 'Available size: M');
});

test('Part A: ES6 checkout calculations and spread copy are correct', () => {
  assert.equal(partA.calculateDiscountedPrice(50000, 10), 45000);
  assert.equal(partA.calculateTotal(100, 200, 300), 600);
  assert.equal(partA.discountedProduct.price, 45000);
  assert.equal(partA.originalProduct.price, 50000);
});

// Part B
test('Part B: cart calculations use price multiplied by quantity', () => {
  const result = partB.calculateCartDetails();
  assert.equal(result.totalCartValue, 70100);
  assert.equal(result.electronicsTotal, 62000);
  assert.deepEqual(result.itemTotals[1], { name: 'Mouse', totalItemPrice: 1600 });
  assert.equal(result.productsAbove2000.length, 3);
});

test('Part B: Map inventory supports lookup, update, deletion and iteration', () => {
  const inventory = partB.createInventory();
  assert.equal(inventory.get(101).name, 'Laptop');
  const result = partB.demonstrateMapOperations(inventory);
  assert.equal(result.selectedProduct.quantity, 2);
  assert.equal(inventory.has(103), false);
  assert.equal(result.entries.length, 4);
});

test('Part B: Set removes duplicate email addresses and preserves first-seen order', () => {
  assert.deepEqual(
    partB.removeDuplicateEmails(['rahul@gmail.com', 'priya@gmail.com', 'rahul@gmail.com']),
    ['rahul@gmail.com', 'priya@gmail.com'],
  );
});

test('Part B: freeze and seal enforce their different property rules', () => {
  const result = partB.demonstrateFreezeAndSeal();
  assert.equal(result.frozenOperations.priceChanged, false);
  assert.equal(result.frozenOperations.propertyAdded, false);
  assert.equal(result.frozenOperations.propertyDeleted, false);
  assert.equal(result.sealedOperations.priceChanged, true);
  assert.equal(result.sealedOperations.propertyAdded, false);
  assert.equal(result.sealedOperations.propertyDeleted, false);
});

// Part C
test('Part C: JSON serialization omits undefined and function object properties', () => {
  const { json, parsed } = partC.serializeOrder();
  assert.equal(json.includes('deliveryDate'), false);
  assert.equal(json.includes('calculateTax'), false);
  assert.equal(parsed.discount, null);
  assert.equal('calculateTax' in parsed, false);
});

test('Part C: all six JSON output/error examples are represented', () => {
  const examples = partC.predictJsonExamples();
  assert.equal(examples.length, 6);
  assert.equal(examples[0].result, '{"name":"Rahul"}');
  assert.equal(examples[1].result, '[10,null,30]');
  assert.equal(examples[2].result, '{"price":null,"discount":null}');
  assert.match(examples[3].result, /^SyntaxError:/);
  assert.match(examples[4].result, /^TypeError:/);
  assert.equal(examples[5].result, '{"createdAt":"2026-01-01T00:00:00.000Z"}');
});

// Part D
test('Part D: mock APIs resolve or reject with the required outcomes', async () => {
  assert.equal(await partD.productsAPI(), 'Products Loaded');
  await assert.rejects(partD.paymentAPI(), /Payment Service Failed/);
  assert.equal(await partD.deliveryAPI(), 'Delivery Loaded');
});

// Part E
test('Part E: debounce invokes only the final call after the delay', async () => {
  let callCount = 0;
  let receivedValue;
  const debounced = partE.debounce((value) => {
    callCount += 1;
    receivedValue = value;
  }, 20);
  debounced('first');
  debounced('second');
  debounced('final');
  await new Promise((resolve) => setTimeout(resolve, 35));
  assert.equal(callCount, 1);
  assert.equal(receivedValue, 'final');
});

test('Part E: throttle limits calls to one per interval', async () => {
  let callCount = 0;
  const throttled = partE.throttle(() => { callCount += 1; }, 25);
  throttled();
  throttled();
  assert.equal(callCount, 1);
  await new Promise((resolve) => setTimeout(resolve, 30));
  throttled();
  assert.equal(callCount, 2);
});

test('Part E: memoization returns the cached result for repeated arguments', () => {
  let calculations = 0;
  const memoized = partE.memoize((price, percentage) => {
    calculations += 1;
    return price - (price * percentage) / 100;
  });
  assert.equal(memoized(50000, 10), 45000);
  assert.equal(memoized(50000, 10), 45000);
  assert.equal(calculations, 1);
});


test('Part E: browser page includes the required DOM controls and local assets', () => {
  const pageDirectory = path.join(__dirname, '..', 'part-e-optimization-events');
  const html = fs.readFileSync(path.join(pageDirectory, 'index.html'), 'utf8');
  const script = fs.readFileSync(path.join(pageDirectory, 'script.js'), 'utf8');
  const styles = fs.readFileSync(path.join(pageDirectory, 'style.css'), 'utf8');
  for (const elementId of [
    'product-search', 'product-list', 'allow-bubbling', 'stop-bubbling',
    'calculate-discount', 'calculate-discount-again', 'scroll-status',
  ]) {
    assert.match(html, new RegExp(`id=\"${elementId}\"`));
  }
  assert.match(script, /addEventListener\('click'/);
  assert.match(script, /event\.stopPropagation\(\)/);
  assert.match(script, /data-action='remove'/);
  assert.match(script, /addEventListener\('scroll'/);
  assert.ok(styles.includes('@media'));
});

// Part F
test('Part F: integrated order computes the reference total and all requested structures', () => {
  const summary = partF.buildOrderSummary();
  assert.equal(summary.orderTotal, 69000);
  assert.equal(summary.uniqueProductIds.size, 4);
  assert.equal(summary.inventory.size, 4);
  assert.deepEqual(summary.productsAbove5000.map((product) => product.name), ['Laptop', 'Monitor']);
  assert.equal(Object.isFrozen(partF.orderConfiguration), true);
  assert.equal(JSON.parse(summary.serializedOrder).total, 69000);
});

test('Part F: async order confirmation reports success', async () => {
  const result = await partF.confirmOrder();
  assert.deepEqual(result, { success: true, status: 'Confirmed Successfully!' });
});
