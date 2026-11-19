'use strict';

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// Task 2: Callback-based sequential processing.
function validateOrder(callback) {
  setTimeout(() => {
    console.log('Order Validated');
    callback(null, 'Order Validated');
  }, 1000);
}

function processPayment(callback) {
  setTimeout(() => {
    console.log('Payment Completed');
    callback(null, 'Payment Completed');
  }, 1000);
}

function sendConfirmation(callback) {
  setTimeout(() => {
    console.log('Confirmation Sent');
    callback(null, 'Confirmation Sent');
  }, 1000);
}

function placeOrderWithCallbacks() {
  return new Promise((resolve, reject) => {
    validateOrder((validationError) => {
      if (validationError) return reject(validationError);
      processPayment((paymentError) => {
        if (paymentError) return reject(paymentError);
        sendConfirmation((confirmationError) => {
          if (confirmationError) return reject(confirmationError);
          resolve('Callback order flow completed');
        });
      });
    });
  });
}

// Task 3: Promise-based versions of the same three steps.
function validateOrderPromise() {
  return wait(1000).then(() => {
    console.log('Order Validated');
    return 'Order Validated';
  });
}

function processPaymentPromise() {
  return wait(1000).then(() => {
    console.log('Payment Completed');
    return 'Payment Completed';
  });
}

function sendConfirmationPromise() {
  return wait(1000).then(() => {
    console.log('Confirmation Sent');
    return 'Confirmation Sent';
  });
}

function placeOrderWithPromises() {
  return validateOrderPromise()
    .then(() => processPaymentPromise())
    .then(() => sendConfirmationPromise())
    .catch((error) => {
      console.error('Promise order failed:', error);
      throw error;
    });
}

// Task 4: Async/await version.
async function placeOrder() {
  try {
    console.log('Order Status: Processing...');
    await validateOrderPromise();
    await processPaymentPromise();
    await sendConfirmationPromise();
    console.log('Order Status: Confirmed Successfully!');
    return { success: true, message: 'Order confirmed successfully' };
  } catch (error) {
    console.error('Order Status: Failed -', error.message);
    return { success: false, message: error.message };
  }
}

// Task 5: Mock APIs with the exact delays and outcomes in the assignment.
function productsAPI() {
  return wait(1000).then(() => 'Products Loaded');
}

function paymentAPI() {
  return wait(1500).then(() => Promise.reject(new Error('Payment Service Failed')));
}

function deliveryAPI() {
  return wait(2000).then(() => 'Delivery Loaded');
}

async function runPromiseCombinators() {
  console.log('\nPromise.all():');
  try {
    const allResults = await Promise.all([productsAPI(), paymentAPI(), deliveryAPI()]);
    console.log(allResults);
  } catch (error) {
    console.log('Promise.all() rejected:', error.message);
  }

  console.log('\nPromise.allSettled():');
  console.log(await Promise.allSettled([productsAPI(), paymentAPI(), deliveryAPI()]));

  console.log('\nPromise.race():');
  try {
    console.log(await Promise.race([productsAPI(), paymentAPI(), deliveryAPI()]));
  } catch (error) {
    console.log('Promise.race() rejected:', error.message);
  }

  console.log('\nPromise.any():');
  try {
    console.log(await Promise.any([productsAPI(), paymentAPI(), deliveryAPI()]));
  } catch (error) {
    console.log('Promise.any() rejected:', error.errors);
  }
}

function demonstrateEventLoop() {
  console.log('Order Started');
  setTimeout(() => console.log('Payment Processing'), 0);
  Promise.resolve().then(() => console.log('Payment Successful'));
  console.log('Order Completed');
}

async function runDemonstration() {
  console.log('--- Part D: Asynchronous JavaScript ---');
  console.log('Event loop output:');
  demonstrateEventLoop();
  await wait(10);

  console.log('\nCallback sequence:');
  await placeOrderWithCallbacks();
  console.log('\nPromise sequence:');
  await placeOrderWithPromises();
  console.log('\nAsync/await sequence:');
  await placeOrder();
  await runPromiseCombinators();
}

if (require.main === module) {
  runDemonstration().catch((error) => {
    console.error('Unexpected asynchronous demonstration error:', error);
    process.exitCode = 1;
  });
}

module.exports = {
  wait,
  validateOrder,
  processPayment,
  sendConfirmation,
  placeOrderWithCallbacks,
  validateOrderPromise,
  processPaymentPromise,
  sendConfirmationPromise,
  placeOrderWithPromises,
  placeOrder,
  productsAPI,
  paymentAPI,
  deliveryAPI,
  runPromiseCombinators,
  demonstrateEventLoop,
};
