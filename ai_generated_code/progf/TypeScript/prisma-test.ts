/**
 * Test script for verifying Prisma client connection and queries
 * Run with: pnpm tsx app/tests/prisma-test.ts
 *
 * Supported via standard GitHub programming aids
 */
import { prisma } from "../../lib/db";

/**
 * Main test function
 */
async function testPrismaConnection() {
  console.log("🔍 Testing Prisma client connection and queries...");

  try {
    // Test 1: Basic connection - count users
    const userCount = await prisma.user.count();
    console.log(
      `✅ Connected to database successfully. Found ${userCount} users.`
    );

    // Test 2: Query with relations - get restaurants with menu items
    const restaurants = await prisma.restaurant.findMany({
      include: {
        menuItems: true,
        managers: {
          include: {
            user: true,
          },
        },
      },
      take: 2, // Limit to 2 for cleaner output
    });

    console.log(`✅ Found ${restaurants.length} restaurants.`);
    for (const restaurant of restaurants) {
      console.log(
        `  - ${restaurant.name} has ${restaurant.menuItems.length} menu items`
      );
      console.log(
        `    Manager: ${restaurant.managers[0]?.user.name || "None"}`
      );
    }

    // Test 3: Query with filters - get available menu items
    const availableItems = await prisma.menuItem.findMany({
      where: {
        isAvailable: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        restaurant: {
          select: {
            name: true,
          },
        },
      },
      take: 3, // Limit to 3 for cleaner output
    });

    console.log(`✅ Found ${availableItems.length} available menu items:`);
    for (const item of availableItems) {
      console.log(
        `  - ${item.name} ($${item.price}) at ${item.restaurant.name}`
      );
    }

    // Test 4: Test a complex query - orders with items
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          include: {
            user: true,
          },
        },
        restaurant: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
      take: 2, // Limit to 2 for cleaner output
    });

    console.log(`✅ Found ${orders.length} orders:`);
    for (const order of orders) {
      console.log(`  - Order ${order.id} by ${order.customer.user.name}:`);
      console.log(`    Restaurant: ${order.restaurant.name}`);
      console.log(`    Status: ${order.status}`);
      console.log(`    Items: ${order.orderItems.length}`);
      for (const item of order.orderItems) {
        console.log(
          `      ${item.quantity}x ${item.menuItem.name} @ $${item.price}`
        );
      }
      console.log(`    Total: $${order.totalAmount}`);
    }

    console.log("🎉 All Prisma client tests passed successfully!");
  } catch (error) {
    console.error("❌ Error testing Prisma client:", error);
    throw error;
  } finally {
    // Close Prisma client connection
    await prisma.$disconnect();
  }
}

// Execute the test function
testPrismaConnection().catch((e) => {
  console.error("❌ Test failed:", e);
  process.exit(1);
});
