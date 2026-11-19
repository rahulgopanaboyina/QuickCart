'use strict';

// Task 1: Debounce delays work until calls stop for the requested duration.
function debounce(callback, delay) {
  let timeoutId;
  return function debouncedCallback(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, args), delay);
  };
}

// Task 2: Throttle permits one callback execution per interval.
function throttle(callback, delay) {
  let lastExecutionTime = 0;
  return function throttledCallback(...args) {
    const currentTime = Date.now();
    if (currentTime - lastExecutionTime >= delay) {
      lastExecutionTime = currentTime;
      callback.apply(this, args);
    }
  };
}

// Task 3: A closure retains the cache between calls.
function memoize(callback) {
  const cache = new Map();
  return function memoizedCallback(...args) {
    const cacheKey = JSON.stringify(args);
    if (cache.has(cacheKey)) {
      console.log('Result came from cache:', cacheKey);
      return cache.get(cacheKey);
    }
    const result = callback.apply(this, args);
    cache.set(cacheKey, result);
    console.log('Fresh calculation:', cacheKey);
    return result;
  };
}

function calculateDiscount(price, percentage) {
  return price - (price * percentage) / 100;
}

const cachedDiscount = memoize(calculateDiscount);

function initializeDomDemonstrations() {
  const searchInput = document.querySelector('#product-search');
  const searchStatus = document.querySelector('#search-status');
  const productList = document.querySelector('#product-list');
  const cartStatus = document.querySelector('#cart-status');
  const bubbleParent = document.querySelector('#bubble-parent');
  const bubbleStatus = document.querySelector('#bubble-status');
  const scrollStatus = document.querySelector('#scroll-status');
  const memoStatus = document.querySelector('#memo-status');

  if (!searchInput || !productList || !bubbleParent) return;

  // Task 1: Attach the 500 ms debounced search to the search input.
  const runSearch = debounce((searchTerm) => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    let visibleCount = 0;
    productList.querySelectorAll('.product-row').forEach((productRow) => {
      const productName = productRow.dataset.productName.toLowerCase();
      const matches = productName.includes(normalizedTerm);
      productRow.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    searchStatus.textContent = normalizedTerm
      ? `${visibleCount} matching product(s) found.`
      : 'Showing all remaining products.';
    console.log('Debounced search executed:', searchTerm);
  }, 500);

  searchInput.addEventListener('input', (event) => runSearch(event.target.value));

  // Task 4: Demonstrate bubbling and stopPropagation on child buttons.
  bubbleParent.addEventListener('click', (event) => {
    if (event.target.closest('button')) {
      bubbleStatus.textContent = 'Parent handler ran: the click bubbled up.';
      console.log('Parent handler: click bubbled to the parent.');
    }
  });

  document.querySelector('#allow-bubbling').addEventListener('click', () => {
    bubbleStatus.textContent = 'Child handler ran. The parent handler will also run.';
  });

  document.querySelector('#stop-bubbling').addEventListener('click', (event) => {
    event.stopPropagation();
    bubbleStatus.textContent = 'Child handler ran and stopped propagation. Parent handler did not run.';
    console.log('Child handler: propagation stopped.');
  });

  // Task 4: One listener on the parent handles all Remove buttons.
  productList.addEventListener('click', (event) => {
    const removeButton = event.target.closest("button[data-action='remove']");
    if (!removeButton || !productList.contains(removeButton)) return;

    const productRow = removeButton.closest('.product-row');
    const removedName = productRow.dataset.productName;
    productRow.remove();
    const remainingCount = productList.querySelectorAll('.product-row').length;
    cartStatus.textContent = `${removedName} removed. ${remainingCount} product(s) remaining.`;
  });

  // Task 2: Attach the 1000 ms throttled callback to the scroll event.
  let handledScrollEvents = 0;
  const handleScroll = throttle(() => {
    handledScrollEvents += 1;
    scrollStatus.textContent = `Scroll events handled: ${handledScrollEvents}`;
    console.log('Throttled scroll handler executed.');
  }, 1000);
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Task 3: Repeated arguments demonstrate a cache hit.
  const showDiscount = () => {
    const result = cachedDiscount(50000, 10);
    memoStatus.textContent = `Final price after 10% discount: ₹${result.toLocaleString('en-IN')}. Check the console for cache status.`;
  };
  document.querySelector('#calculate-discount').addEventListener('click', showDiscount);
  document.querySelector('#calculate-discount-again').addEventListener('click', showDiscount);
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeDomDemonstrations);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { debounce, throttle, memoize, calculateDiscount };
}
