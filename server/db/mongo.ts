import mongoose, { Schema } from "mongoose";
import type { Dream, DreamRepo, Repos, User, UserRepo } from "./types";

const UserSchema = new Schema({
  name: String,
  email: { type: String, index: true, unique: true },
  passwordHash: String,
  authProvider: { type: String, enum: ["local", "google"], required: true },
  googleId: String,
  createdAt: { type: Date, default: () => new Date() },
});

const DreamSchema = new Schema({
  userId: { type: String, index: true },
  text: String,
  summary: String,
  keywords: [String],
  emotions: Schema.Types.Mixed,
  timestamp: { type: Date, default: () => new Date() },
  imageURL: String,
  analysisJSON: Schema.Types.Mixed,
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
const DreamModel = mongoose.models.Dream || mongoose.model("Dream", DreamSchema);

class MongoUserRepo implements UserRepo {
  async createLocalUser(data: { name: string; email: string; passwordHash: string }): Promise<User> {
    const u = await UserModel.create({ ...data, authProvider: "local" });
    return toUser(u);
  }
  async findByEmail(email: string): Promise<User | null> {
    const u = await UserModel.findOne({ email }).exec();
    return u ? toUser(u) : null;
  }
  async findById(id: string): Promise<User | null> {
    const u = await UserModel.findById(id).exec();
    return u ? toUser(u) : null;
  }
  async findOrCreateGoogle(data: { googleId: string; name: string; email: string }): Promise<User> {
    let u = await UserModel.findOne({ googleId: data.googleId }).exec();
    if (!u) {
      u = await UserModel.findOneAndUpdate(
        { email: data.email },
        { $setOnInsert: { ...data, authProvider: "google" } },
        { upsert: true, new: true }
      ).exec();
    }
    return toUser(u);
  }
}

class MongoDreamRepo implements DreamRepo {
  async create(data: Omit<Dream, "id">): Promise<Dream> {
    const d = await DreamModel.create(data);
    return toDream(d);
  }
  async listByUser(userId: string): Promise<Dream[]> {
    const list = await DreamModel.find({ userId }).sort({ timestamp: -1 }).exec();
    return list.map(toDream);
  }
  async getByIdOwned(userId: string, id: string): Promise<Dream | null> {
    const d = await DreamModel.findOne({ _id: id, userId }).exec();
    return d ? toDream(d) : null;
  }
  async update(id: string, patch: Partial<Dream>): Promise<Dream | null> {
    const d = await DreamModel.findByIdAndUpdate(id, { $set: patch }, { new: true }).exec();
    return d ? toDream(d) : null;
  }
}

function toUser(doc: any): User {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    passwordHash: doc.passwordHash,
    authProvider: doc.authProvider,
    googleId: doc.googleId,
    createdAt: doc.createdAt,
  };
}

function toDream(doc: any): Dream {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    text: doc.text,
    summary: doc.summary,
    keywords: doc.keywords || [],
    emotions: doc.emotions || {},
    timestamp: doc.timestamp,
    imageURL: doc.imageURL,
    analysisJSON: doc.analysisJSON,
  };
}

export async function createMongoRepos(uri: string): Promise<Repos> {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(uri);
  }
  return { users: new MongoUserRepo(), dreams: new MongoDreamRepo() };
}
