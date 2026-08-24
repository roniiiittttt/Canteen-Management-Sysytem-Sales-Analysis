require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Menu = require('./models/menu');
const Order = require('./models/Order');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
};

const fakeUsers = [
  { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'customer' },
  { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'customer' },
  { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', role: 'customer' },
  { name: 'Bob Brown', email: 'bob@example.com', password: 'password123', role: 'customer' },
  { name: 'Charlie Davis', email: 'charlie@example.com', password: 'password123', role: 'customer' },
  { name: 'Diana Evans', email: 'diana@example.com', password: 'password123', role: 'customer' },
  { name: 'Frank Green', email: 'frank@example.com', password: 'password123', role: 'customer' }
];

const fakeMenu = [
  { name: 'Margherita Pizza', price: 299, category: 'Pizza', description: 'Classic cheese and tomato pizza' },
  { name: 'Pepperoni Pizza', price: 349, category: 'Pizza', description: 'Loaded with pepperoni' },
  { name: 'Veggie Burger', price: 149, category: 'Burger', description: 'Crispy veggie patty with fresh lettuce' },
  { name: 'Chicken Burger', price: 199, category: 'Burger', description: 'Grilled chicken patty with mayo' },
  { name: 'French Fries', price: 99, category: 'Sides', description: 'Crispy golden fries' },
  { name: 'Garlic Bread', price: 129, category: 'Sides', description: 'Toasted bread with garlic butter' },
  { name: 'Cold Coffee', price: 119, category: 'Beverages', description: 'Refreshing iced coffee' },
  { name: 'Mango Shake', price: 139, category: 'Beverages', description: 'Thick mango milkshake' },
  { name: 'Chocolate Brownie', price: 159, category: 'Desserts', description: 'Warm fudgy brownie' },
  { name: 'Masala Dosa', price: 180, category: 'South Indian', description: 'Crispy dosa with potato filling' },
  { name: 'Paneer Butter Masala', price: 250, category: 'North Indian', description: 'Rich paneer gravy' },
  { name: 'Butter Naan', price: 40, category: 'North Indian', description: 'Soft buttery flatbread' },
  { name: 'Fried Rice', price: 160, category: 'Chinese', description: 'Wok tossed veggie rice' },
  { name: 'Hakka Noodles', price: 170, category: 'Chinese', description: 'Stir fried noodles with veggies' }
];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const generateData = async () => {
  await connectDB();

  console.log('Clearing old data (except existing admins/users)...');
  await Order.deleteMany({});
  await Menu.deleteMany({});
  
  // Insert fake menu
  console.log('Inserting Menu Items...');
  const insertedMenu = await Menu.insertMany(fakeMenu);

  // Insert fake users (only if they don't exist)
  console.log('Inserting Customers...');
  const customers = [];
  for (const u of fakeUsers) {
    let existingUser = await User.findOne({ email: u.email });
    if (!existingUser) {
      existingUser = await User.create(u);
    }
    customers.push(existingUser);
  }

  // Generate fake orders over the last 90 days
  console.log('Generating 400 Fake Orders for the past 90 days...');
  const orders = [];
  const now = new Date();
  const past90Days = new Date();
  past90Days.setDate(now.getDate() - 90);

  const paymentMethods = ["Cash", "UPI", "Card"];
  
  for (let i = 0; i < 400; i++) {
    const orderDate = randomDate(past90Days, now);
    
    // Pick a random customer
    const customer = customers[Math.floor(Math.random() * customers.length)];
    
    // Pick 1 to 4 random items
    const numItems = Math.floor(Math.random() * 4) + 1;
    const items = [];
    let totalAmount = 0;
    
    for(let j=0; j<numItems; j++) {
      const menuItem = insertedMenu[Math.floor(Math.random() * insertedMenu.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      
      // avoid duplicates in same order
      if(!items.find(i => i.menuItem === menuItem._id)) {
        items.push({ menuItem: menuItem._id, quantity });
        totalAmount += menuItem.price * quantity;
      }
    }
    
    const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    orders.push({
      user: customer._id,
      items,
      totalAmount,
      paymentMethod: method,
      paymentStatus: 'Paid',
      status: 'Delivered',
      createdAt: orderDate,
      updatedAt: orderDate
    });
  }

  await Order.insertMany(orders);
  console.log('Successfully generated fake testing data!');
  process.exit();
};

generateData();
