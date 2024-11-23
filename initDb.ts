import PocketBase from 'pocketbase';

export default async function initializeDatabase(pb: PocketBase) {


  // Initialize collections
  await createProductCollection(pb);
  await createOrderCollection(pb);
  await createMeetingRoomCollection(pb);
  await createAppointmentCollection(pb);

  console.log('Database initialization complete.');
}

// Function to create the 'products' collection
async function createProductCollection(pb: PocketBase) {
  const collectionName = 'products';

  // Check if collection exists
  const exists = await checkCollectionExists(pb, collectionName);

  if (!exists) {
    const collection = {
      name: collectionName,
      type: 'base',
      schema: [
        {
          name: 'name',
          type: 'text',
          required: true,
          unique: false,
        },
        {
          name: 'category',
          type: 'text',
          required: true,
          unique: false,
        },
        {
          name: 'specifications',
          type: 'text',
          required: false,
          unique: false,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          unique: false,
        },
        {
          name: 'stockQuantity',
          type: 'number',
          required: true,
          unique: false,
        },
      ],
      options: {},
    };

    await pb.collections.create(collection);
    console.log(`Collection '${collectionName}' created.`);
  } else {
    console.log(`Collection '${collectionName}' already exists.`);
  }
}

async function createOrderCollection(pb: PocketBase) {
    const collectionName = 'orders';
  
    const exists = await checkCollectionExists(pb, collectionName);
  
    if (!exists) {
      // Get the collection ID of the 'products' collection
      const productsCollectionId = await getCollectionId(pb, 'products');
  
      const collection = {
        name: collectionName,
        type: 'base',
        schema: [
          {
            name: 'customerId',
            type: 'text',
            system: false,
            required: true,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: '',
            },
          },
          {
            name: 'orderDate',
            type: 'date',
            system: false,
            required: true,
            unique: false,
            options: {
              min: null,
              max: null,
              enableTime: false,
            },
          },
          {
            name: 'status',
            type: 'select',
            system: false,
            required: true,
            unique: false,
            options: {
              maxSelect: 1,
              values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            },
          },
          {
            name: 'items',
            type: 'relation',
            system: false,
            required: true,
            unique: false,
            options: {
              collectionId: productsCollectionId,
              cascadeDelete: false,
              minSelect: 1,
              maxSelect: null, // Allow multiple products
            },
          },
          {
            name: 'totalAmount',
            type: 'number',
            system: false,
            required: true,
            unique: false,
            options: {
              min: 0,
              max: null,
              // decimalPlaces: 2,
            },
          },
          {
            name: 'deliveryDate',
            type: 'date',
            system: false,
            required: false,
            unique: false,
            options: {
              min: null,
              max: null,
              enableTime: false,
            },
          },
        ],
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        options: {},
      };
  
      try {
        await pb.collections.create(collection);
        console.log(`Collection '${collectionName}' created.`);
      } catch (error: any) {
        console.error(`Error creating collection '${collectionName}':`, error.data);
      }
    } else {
      console.log(`Collection '${collectionName}' already exists.`);
    }
  }
  
  
    
  
// Function to create the 'meeting_rooms' collection
async function createMeetingRoomCollection(pb: PocketBase) {
    const collectionName = 'meeting_rooms';
  
    const exists = await checkCollectionExists(pb, collectionName);
  
    if (!exists) {
      const collection = {
        name: collectionName,
        type: 'base',
        schema: [
          {
            name: 'name',
            type: 'text',
            system: false,
            required: true,
            unique: true,
            options: {
              min: null,
              max: null,
              pattern: '',
            },
          },
          {
            name: 'location',
            type: 'text',
            system: false,
            required: true,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: '',
            },
          },
          {
            name: 'capacity',
            type: 'number',
            system: false,
            required: true,
            unique: false,
            options: {
              min: 0,
              max: null,
              // decimalPlaces: 0, // If you want to enforce integer values
            },
          },
          {
            name: 'features',
            type: 'json',
            system: false,
            required: false,
            unique: false,
            options: {
              default: '[]',    // Stringified empty array or '{}' for an object
              maxSize: 10000,   // Set an appropriate max size in bytes
            },
          },
        ],
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        options: {},
      };
  
      try {
        await pb.collections.create(collection);
        console.log(`Collection '${collectionName}' created.`);
      } catch (error: any) {
        console.error(`Error creating collection '${collectionName}':`, JSON.stringify(error.response, null, 2));
      }
    } else {
      console.log(`Collection '${collectionName}' already exists.`);
    }
  }
  
// Function to create the 'appointments' collection
async function createAppointmentCollection(pb: PocketBase) {
    const collectionName = 'appointments';
  
    const exists = await checkCollectionExists(pb, collectionName);
  
    if (!exists) {
      // Retrieve collectionId for 'meeting_rooms' before defining the schema
      const meetingRoomsCollectionId = await getCollectionId(pb, 'meeting_rooms');
  
      const collection = {
        name: collectionName,
        type: 'base',
        schema: [
          // Relation field 'roomId'
          {
            name: 'roomId',
            type: 'relation',
            system: false,
            required: true,
            unique: false,
            options: {
              collectionId: meetingRoomsCollectionId,
              cascadeDelete: false,
              minSelect: null,
              maxSelect: 1,
            },
          },
          // Text field 'organizerId'
          {
            name: 'organizerId',
            type: 'text',
            system: false,
            required: true,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: '',
            },
          },
          // JSON field 'attendees'
          {
            name: 'attendees',
            type: 'json',
            system: false,
            required: false,
            unique: false,
            options: {
              default: '[]',    // Stringified empty array
              maxSize: 10000,   // Adjust size as needed
            },
          },
          // Text field 'purpose'
          {
            name: 'purpose',
            type: 'text',
            system: false,
            required: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: '',
            },
          },
          // Date field 'date'
          {
            name: 'date',
            type: 'date',
            system: false,
            required: true,
            unique: false,
            options: {
              min: null,
              max: null,
              enableTime: false, // Date only
            },
          },
          // Date field 'startTime'
          {
            name: 'startTime',
            type: 'date',
            system: false,
            required: true,
            unique: false,
            options: {
              enableTime: true,  // Include time
              min: null,
              max: null,
            },
          },
          // Date field 'endTime'
          {
            name: 'endTime',
            type: 'date',
            system: false,
            required: true,
            unique: false,
            options: {
              enableTime: true,  // Include time
              min: null,
              max: null,
            },
          },
        ],
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        options: {},
      };
  
      try {
        await pb.collections.create(collection);
        console.log(`Collection '${collectionName}' created.`);
      } catch (error: any) {
        console.error(`Error creating collection '${collectionName}':`, JSON.stringify(error.response, null, 2));
      }
    } else {
      console.log(`Collection '${collectionName}' already exists.`);
    }
  }
  

// Helper function to check if a collection exists
async function checkCollectionExists(pb: PocketBase, collectionName: string): Promise<boolean> {
  try {
    await pb.collections.getOne(collectionName);
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to get a collection's ID by name
async function getCollectionId(pb: PocketBase, collectionName: string): Promise<string> {
  const collection = await pb.collections.getOne(collectionName);
  return collection.id;
}
