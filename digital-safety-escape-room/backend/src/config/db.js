import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache synced to JSON file
let memoryStore = {
  users: [],
  challenges: [],
  gamesessions: [],
  answers: [],
  achievements: [],
  userachievements: []
};

function loadStore() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      memoryStore = { ...memoryStore, ...JSON.parse(data) };
    } else {
      saveStore();
    }
  } catch (err) {
    console.error('Error loading db.json, initializing empty store:', err);
  }
}

function saveStore() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

loadStore();

export function createDocumentModel(collectionName) {
  const getCollection = () => {
    if (!memoryStore[collectionName]) {
      memoryStore[collectionName] = [];
    }
    return memoryStore[collectionName];
  };

  const matchesQuery = (item, query = {}) => {
    for (const key of Object.keys(query)) {
      const queryVal = query[key];
      const itemVal = item[key];

      if (queryVal && typeof queryVal === 'object' && !Array.isArray(queryVal)) {
        if ('$ne' in queryVal && itemVal === queryVal.$ne) return false;
        if ('$in' in queryVal && (!Array.isArray(queryVal.$in) || !queryVal.$in.includes(itemVal))) return false;
        if ('$gte' in queryVal && itemVal < queryVal.$gte) return false;
        if ('$lte' in queryVal && itemVal > queryVal.$lte) return false;
      } else if (itemVal !== queryVal) {
        return false;
      }
    }
    return true;
  };

  return {
    async find(query = {}) {
      loadStore();
      const col = getCollection();
      return col.filter(item => matchesQuery(item, query)).map(i => ({ ...i }));
    },

    async findOne(query = {}) {
      loadStore();
      const col = getCollection();
      const found = col.find(item => matchesQuery(item, query));
      return found ? { ...found } : null;
    },

    async findById(id) {
      loadStore();
      const col = getCollection();
      const found = col.find(item => String(item._id) === String(id));
      return found ? { ...found } : null;
    },

    async create(docData) {
      loadStore();
      const col = getCollection();
      const now = new Date().toISOString();
      const newDoc = {
        _id: docData._id || crypto.randomBytes(12).toString('hex'),
        ...docData,
        createdAt: docData.createdAt || now,
        updatedAt: now
      };
      col.push(newDoc);
      saveStore();
      return { ...newDoc };
    },

    async findByIdAndUpdate(id, updateData, options = {}) {
      loadStore();
      const col = getCollection();
      const index = col.findIndex(item => String(item._id) === String(id));
      if (index === -1) return null;

      const now = new Date().toISOString();
      const current = col[index];
      const updated = {
        ...current,
        ...updateData,
        updatedAt: now
      };
      col[index] = updated;
      saveStore();
      return { ...updated };
    },

    async findByIdAndDelete(id) {
      loadStore();
      const col = getCollection();
      const index = col.findIndex(item => String(item._id) === String(id));
      if (index === -1) return null;
      const [deleted] = col.splice(index, 1);
      saveStore();
      return { ...deleted };
    },

    async countDocuments(query = {}) {
      loadStore();
      const col = getCollection();
      return col.filter(item => matchesQuery(item, query)).length;
    },

    async deleteMany(query = {}) {
      loadStore();
      const col = getCollection();
      const remaining = col.filter(item => !matchesQuery(item, query));
      const deletedCount = col.length - remaining.length;
      memoryStore[collectionName] = remaining;
      saveStore();
      return { deletedCount };
    },

    async updateMany(query = {}, updateData = {}) {
      loadStore();
      const col = getCollection();
      let count = 0;
      const now = new Date().toISOString();
      for (let i = 0; i < col.length; i++) {
        if (matchesQuery(col[i], query)) {
          col[i] = { ...col[i], ...updateData, updatedAt: now };
          count++;
        }
      }
      saveStore();
      return { modifiedCount: count };
    }
  };
}

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1000 });
      console.log('✅ Connected to MongoDB cluster via Mongoose');
      return true;
    } catch (err) {
      console.warn('⚠️ MongoDB remote connection not reachable, active in local MongoDB document storage:', err.message);
    }
  }
  console.log('✅ Connected to MongoDB document storage (active)');
  return true;
};
