export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  authProvider: "local" | "google";
  googleId?: string;
  createdAt: Date;
}

export interface Dream {
  id: string;
  userId: string;
  text: string;
  summary: string;
  keywords: string[];
  emotions: Record<string, number>;
  timestamp: Date;
  imageURL?: string;
  analysisJSON?: any;
}

export interface UserRepo {
  createLocalUser(data: { name: string; email: string; passwordHash: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findOrCreateGoogle(data: { googleId: string; name: string; email: string }): Promise<User>;
}

export interface DreamRepo {
  create(data: Omit<Dream, "id">): Promise<Dream>;
  listByUser(userId: string): Promise<Dream[]>;
  getByIdOwned(userId: string, id: string): Promise<Dream | null>;
  update(id: string, patch: Partial<Dream>): Promise<Dream | null>;
}

export interface Repos {
  users: UserRepo;
  dreams: DreamRepo;
}
