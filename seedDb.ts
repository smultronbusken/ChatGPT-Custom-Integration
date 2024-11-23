import PocketBase from 'pocketbase';
import * as fs from 'node:fs/promises';

export default async function seedDatabase(pb: PocketBase) {
  // Load all seed data from the combined file
  const seedData = await loadData('seedData.json');

  // Seed each collection
  await seedProducts(pb, seedData.products);
  await seedMeetingRooms(pb, seedData.meeting_rooms);
  await seedOrders(pb, seedData.orders);
  await seedAppointments(pb, seedData.appointments);
}

// Function to seed products
async function seedProducts(pb: PocketBase, products: any[]) {
  for (const product of products) {
    await upsertRecord(pb, 'products', product, `product '${product.name}'`);
  }
}

// Function to seed meeting rooms
async function seedMeetingRooms(pb: PocketBase, rooms: any[]) {
  for (const room of rooms) {
    await upsertRecord(pb, 'meeting_rooms', room, `meeting room '${room.name}'`);
  }
}

// Function to seed orders
async function seedOrders(pb: PocketBase, orders: any[]) {
  for (const order of orders) {
    await upsertRecord(pb, 'orders', order, `order with ID '${order.id}'`);
  }
}

// Function to seed appointments
async function seedAppointments(pb: PocketBase, appointments: any[]) {
  for (const appointment of appointments) {
    await upsertRecord(pb, 'appointments', appointment, `appointment with ID '${appointment.id}'`);
  }
}

// Generic upsert function
async function upsertRecord(pb: PocketBase, collectionName: string, data: any, logIdentifier: string) {
  try {
    // Try to get the existing record
    await pb.collection(collectionName).getOne(data.id, {});

    // If exists, update the record
    await pb.collection(collectionName).update(data.id, data);
    console.log(`Updated ${logIdentifier}`);
  } catch (error: any) {
    if (error.status === 404) {
      // If not found, create the record
      try {
        await pb.collection(collectionName).create(data, { $autoCancel: false });
        console.log(`Inserted ${logIdentifier}`);
      } catch (createError) {
        console.error(`Error inserting ${logIdentifier}:`, createError);
      }
    } else {
      console.error(`Error processing ${logIdentifier}:`, error);
    }
  }
}

// Helper function to load data from a JSON file
async function loadData(filename: string) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading data from '${filename}':`, error);
    return {};
  }
}
