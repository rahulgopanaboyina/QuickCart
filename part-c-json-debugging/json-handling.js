'use strict';

function createOrder() {
  return {
    orderId: 501,
    customer: 'Rahul',
    amount: 5000,
    deliveryDate: undefined,
    discount: null,
    calculateTax() {
      return 500;
    },
  };
}

function serializeOrder(order = createOrder()) {
  const json = JSON.stringify(order);
  return { json, parsed: JSON.parse(json) };
}

function predictJsonExamples() {
  const user = { name: 'Rahul' };
  user.self = user;

  const examples = [
    {
      question: 'Q1 – undefined in an object',
      result: JSON.stringify({ name: 'Rahul', age: undefined }),
    },
    {
      question: 'Q2 – undefined in an array',
      result: JSON.stringify([10, undefined, 30]),
    },
    {
      question: 'Q3 – NaN and Infinity',
      result: JSON.stringify({ price: NaN, discount: Infinity }),
    },
    {
      question: 'Q4 – invalid JSON',
      result: captureError(() => JSON.parse("{name: 'Rahul', age: 25}")),
    },
    {
      question: 'Q5 – circular reference',
      result: captureError(() => JSON.stringify(user)),
    },
    {
      question: 'Q6 – Date object',
      result: JSON.stringify({ createdAt: new Date('2026-01-01') }),
    },
  ];

  return examples;
}

function captureError(operation) {
  try {
    return operation();
  } catch (error) {
    return `${error.name}: ${error.message}`;
  }
}

function runDemonstration() {
  console.log('--- Part C: JSON Handling & Debugging ---');
  const order = createOrder();
  const serialized = serializeOrder(order);
  console.log('Serialized order:', serialized.json);
  console.log('Parsed order:', serialized.parsed);
  console.log('Original properties:', Object.keys(order));
  console.log('Parsed properties:', Object.keys(serialized.parsed));
  console.log('Tax function exists after parsing:', 'calculateTax' in serialized.parsed);
  console.log('Output predictions:');
  predictJsonExamples().forEach(({ question, result }) => console.log(question, '=>', result));
}

if (require.main === module) runDemonstration();

module.exports = { createOrder, serializeOrder, predictJsonExamples, captureError };
