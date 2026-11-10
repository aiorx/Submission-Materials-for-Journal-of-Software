/**
 * Prisma seed script to populate the database with initial test data
 * Run with: npx prisma db seed
 *
 * Assisted using common GitHub development utilities
 */
var hashPassword = require('../server/auth').hashPassword;
var PrismaClient = require('@/prisma/app/generated/prisma/client').PrismaClient;

var prisma = new PrismaClient();

/**
 * Main seed function
 */
async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (optional - be careful in production)
  await clearDatabase();

  // Create admin user
  var adminPassword = await hashPassword("admin123");
  var admin = await prisma.user.create({
    data: {
      email: "admin@dashi.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("👤 Created admin user: " + (admin.email) + "");

  // Create restaurant manager users and restaurants
  var restaurants = [
    {
      name: "Pizza Palace",
      description: "Best pizza in town with authentic Italian recipes",
      email: "info@pizzapalace.com",
      phoneNumber: "+243123456789",
      address: "123 Main St, Goma, DRC",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
      category: "Italian",
      preparationTime: "20-30 minutes",
      deliveryFee: 2.99,
      serviceArea: "Central Goma",
      manager: {
        email: "manager@pizzapalace.com",
        name: "Mario Pizza",
      },
    },
    {
      name: "Burger Bliss",
      description: "Juicy burgers with fresh ingredients",
      email: "info@burgerbliss.com",
      phoneNumber: "+243987654321",
      address: "456 Oak Ave, Goma, DRC",
      imageUrl: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
      category: "Fast Food",
      preparationTime: "15-25 minutes",
      deliveryFee: 1.99,
      serviceArea: "All of Goma",
      manager: {
        email: "manager@burgerbliss.com",
        name: "Bob Burger",
      },
    },
    {
      name: "Sushi Sensation",
      description: "Fresh and delicious sushi made with care",
      email: "info@sushisensation.com",
      phoneNumber: "+243456789123",
      address: "789 Elm Blvd, Goma, DRC",
      imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
      category: "Japanese",
      preparationTime: "25-40 minutes",
      deliveryFee: 3.99,
      serviceArea: "North Goma",
      manager: {
        email: "manager@sushisensation.com",
        name: "Sakura Sushi",
      },
    },
  ];

  // Create restaurants and their managers
  for (var restaurantData of restaurants) {
    var manager = restaurantData.manager;

    // Create manager user
    var managerPassword = await hashPassword("manager123");
    var managerUser = await prisma.user.create({
      data: {
        email: manager.email,
        name: manager.name,
        password: managerPassword,
        role: "RESTAURANT",
      },
    });    // Create restaurant
    var restaurant = await prisma.restaurant.create({
      data: {
        name: restData.name,
        description: restData.description,
        email: restData.email,
        phoneNumber: restData.phoneNumber,
        address: restData.address,
        serviceArea: restData.serviceArea || "Goma",
        imageUrl: restData.imageUrl,
        category: restData.category,
        preparationTime: restData.preparationTime,
        deliveryFee: parseFloat(String(restData.deliveryFee || 0)),
        rating: 0,
        ratingCount: 0,
        isActive: true,
      },
    });
    
    // Create restaurant manager with link to restaurant
    await prisma.restaurantManager.create({
      data: {
        userId: managerUser.id,
        phoneNumber: restData.phoneNumber || "+243999999999", // Use restaurant phone or default
        restaurantId: restaurant.id,
      }
    });

    // Create menu items for this restaurant
    await createMenuItems(restaurant.id);

    console.log(
      "🍽️ Created restaurant: " + (restaurant.name) + " with manager: " + (managerUser.email) + ""
    );
  }

  // Create customer users
  var customers = [
    {
      email: "john@example.com",
      name: "John Doe",
      phoneNumber: "+243111222333",
      address: "321 Pine St, Goma, DRC",
    },
    {
      email: "jane@example.com",
      name: "Jane Smith",
      phoneNumber: "+243444555666",
      address: "654 Cedar Rd, Goma, DRC",
    },
    {
      email: "sam@example.com",
      name: "Sam Wilson",
      phoneNumber: "+243777888999",
      address: "987 Birch Ave, Goma, DRC",
    },
  ];

  for (var customerData of customers) {
    var email = customerData.email;
var name = customerData.name;
var phoneNumber = customerData.phoneNumber;
var address = customerData.address;

    // Create customer user
    var customerPassword = await hashPassword("customer123");
    var customerUser = await prisma.user.create({
      data: {
        email,
        name,
        password: customerPassword,
        role: "CUSTOMER",
        customer: {
          create: {
            phoneNumber,
            address,
          },
        },
      },
    });

    console.log("👤 Created customer: " + (customerUser.email) + "");
  }

  // Create sample orders
  await createSampleOrders();

  console.log("✅ Database seeding completed successfully");
}

/**
 * Create menu items for a restaurant
 */
async function createMenuItems(restaurantId: string) {
  var menuItems = [
    {
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: 12.99,
      category: "Pizza",
      imageUrl:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    },
    {
      name: "Pepperoni Pizza",
      description: "Pizza with tomato sauce, mozzarella, and pepperoni",
      price: 14.99,
      category: "Pizza",
      imageUrl:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    },
    {
      name: "Veggie Burger",
      description: "Plant-based burger with lettuce, tomato, and special sauce",
      price: 10.99,
      category: "Burger",
      imageUrl:
        "https://images.unsplash.com/photo-1520072959219-c595dc870360?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    },
    {
      name: "Classic Burger",
      description: "Beef patty with cheese, lettuce, tomato, and sauce",
      price: 11.99,
      category: "Burger",
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    },
    {
      name: "California Roll",
      description: "Sushi roll with crab, avocado, and cucumber",
      price: 8.99,
      category: "Sushi",
      imageUrl:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    },
    {
      name: "French Fries",
      description: "Crispy golden fries with salt",
      price: 4.99,
      category: "Sides",
      imageUrl:
        "https://images.unsplash.com/photo-1585109649139-366815a0d713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    },
  ];

  for (var item of menuItems) {
    await prisma.menuItem.create({
      data: {
        ...item,
        restaurantId,
      },
    });
  }
}

/**
 * Create sample orders
 */
async function createSampleOrders() {
  // Get customers
  var customers = await prisma.customer.findMany({
    include: { user: true },
  });

  // Get restaurants with menu items
  var restaurants = await prisma.restaurant.findMany({
    include: { menuItems: true },
  });

  // For each customer, create a couple of orders
  for (var customer of customers) {
    // Create orders from different restaurants
    for (var restaurant of restaurants) {
      if (restaurant.menuItems.length === 0) continue;

      // Select random menu items (1-3 items)
      var menuItems = restaurant.menuItems.slice(
        0,
        Math.floor(Math.random() * 3) + 1
      );

      // Calculate total amount
      var totalAmount = 0;
      var orderItems = menuItems.map(function (item) {
        var quantity = Math.floor(Math.random() * 2) + 1;
        totalAmount += Number(item.price) * quantity;

        return {
          menuItemId: item.id,
          quantity,
          price: item.price,
        };
      });

      // Generate a random 4-digit order number for display
      var randomNumber = Math.floor(1000 + Math.random() * 9000);
      var displayOrderNumber = "#" + (randomNumber) + "";
      
      // Create the order
      await prisma.order.create({
        data: {
          totalAmount,
          status: "PLACED",
          customerId: customer.id,
          restaurantId: restaurant.id,
          customerNotes: "Please deliver ASAP. Thank you!",
          deliveryAddress: customer.address || "Default Address",
          orderNumber: randomNumber, // Store the numeric value
          displayOrderNumber: displayOrderNumber, // Store the formatted string
          orderItems: {
            create: orderItems,
          },
        },
      });
    }
  }

  console.log("📦 Created sample orders");
}

/**
 * Clear existing data (use with caution)
 */
async function clearDatabase() {
  // Order of deletion matters due to foreign key constraints
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurantManager.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️ Cleared existing data");
}

// Execute the main function
main()
  .catch(function (e) {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async function () {
    // Close Prisma client connection
    await prisma.$disconnect();
  });
