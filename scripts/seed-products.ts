import 'dotenv/config';

// Seeder for DynamoDB products table
import { createProduct } from "../app/models/product-dynamo.ts";
import { products } from "../app/context/products.ts";

async function seedProducts() {
  for (const product of products) {
    // Convert id and price to string for DynamoDB
    const item = {
      ...product,
      id: product.id.toString(),
      price: product.price.toString(),
    };
    try {
      await createProduct(item);
      console.log(`Seeded: ${item.name}`);
    } catch (err) {
      console.error(`Failed to seed ${item.name}:`, err);
    }
  }
  console.log("Seeding complete.");
}

seedProducts();
