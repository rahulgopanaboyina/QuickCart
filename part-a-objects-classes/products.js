'use strict';

// Task 1: Constructor function and prototype-based method.
const prototypeProducts = (() => {
  function Product(productName, price, category) {
    this.productName = productName;
    this.price = price;
    this.category = category;
  }

  Product.prototype.displayProduct = function displayProduct() {
    return `${this.productName} - ₹${this.price} (${this.category})`;
  };

  return {
    Product,
    products: [
      new Product('Laptop', 50000, 'Electronics'),
      new Product('Mouse', 800, 'Accessories'),
      new Product('T-Shirt', 1200, 'Clothing'),
    ],
  };
})();

// Task 2: ES6 classes. This class is intentionally scoped separately from
// the constructor function above because both assignment tasks name it Product.
const classProducts = (() => {
  class Product {
    constructor(productName, price, category) {
      this.productName = productName;
      this.price = price;
      this.category = category;
    }

    getProductDetails() {
      return `${this.productName} - ₹${this.price} (${this.category})`;
    }
  }

  class ElectronicProduct extends Product {
    constructor(productName, price, warrantyYears) {
      super(productName, price, 'Electronics');
      this.warrantyYears = warrantyYears;
    }

    getWarrantyDetails() {
      return `${this.warrantyYears}-year warranty`;
    }
  }

  class ClothingProduct extends Product {
    constructor(productName, price, size) {
      super(productName, price, 'Clothing');
      this.size = size;
    }

    getSizeDetails() {
      return `Available size: ${this.size}`;
    }
  }

  return { Product, ElectronicProduct, ClothingProduct };
})();

// Task 3: ES6 syntax used in checkout.
const calculateDiscountedPrice = (price, discountPercentage) =>
  price - (price * discountPercentage) / 100;

const customer = { name: 'Rahul', email: 'rahul@gmail.com', city: 'Mumbai' };
const { name, email } = customer;

function calculateTotal(...prices) {
  return prices.reduce((total, price) => total + price, 0);
}

const originalProduct = { productName: 'Laptop', price: 50000, category: 'Electronics' };
const discountedProduct = { ...originalProduct, price: 45000 };

function runDemonstration() {
  console.log('--- Part A: Objects, Prototypes & ES6 Classes ---');
  prototypeProducts.products.forEach((product) => console.log(product.displayProduct()));

  const electronic = new classProducts.ElectronicProduct('Laptop', 50000, 2);
  const clothing = new classProducts.ClothingProduct('Jacket', 3000, 'M');
  console.log(electronic.getProductDetails(), electronic.getWarrantyDetails());
  console.log(clothing.getProductDetails(), clothing.getSizeDetails());

  console.log(`Hello Rahul, your order of Laptop is confirmed. Total: ₹50000.`);
  console.log('Customer:', name, email);
  console.log('Price after 10% discount:', calculateDiscountedPrice(50000, 10));
  console.log('Total:', calculateTotal(50000, 800, 1500));
  console.log('Original product:', originalProduct);
  console.log('Copied product:', discountedProduct);
}

if (require.main === module) runDemonstration();

module.exports = {
  prototypeProducts,
  classProducts,
  calculateDiscountedPrice,
  customer,
  calculateTotal,
  originalProduct,
  discountedProduct,
};
