import type { Dream, DreamRepo, Repos, User, UserRepo } from "./types";

const users = new Map<string, User>();
const dreams = new Map<string, Dream>();

function id() {
  return (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)) as string;
}

class MemoryUserRepo implements UserRepo {
  async createLocalUser(data: { name: string; email: string; passwordHash: string }): Promise<User> {
    const u: User = { id: id(), createdAt: new Date(), authProvider: "local", ...data };
    users.set(u.id, u);
    return u;
  }
  async findByEmail(email: string): Promise<User | null> {
    for (const u of users.values()) if (u.email.toLowerCase() === email.toLowerCase()) return u;
    return null;
  }
  async findById(idv: string): Promise<User | null> {
    return users.get(idv) || null;
  }
  async findOrCreateGoogle(data: { googleId: string; name: string; email: string }): Promise<User> {
    for (const u of users.values()) if (u.googleId === data.googleId) return u;
    const existing = await this.findByEmail(data.email);
    if (existing) return existing;
    const u: User = { id: id(), createdAt: new Date(), authProvider: "google", ...data };
    users.set(u.id, u);
    return u;
  }
}

class MemoryDreamRepo implements DreamRepo {
  async create(data: Omit<Dream, "id">): Promise<Dream> {
    const d: Dream = { id: id(), ...data };
    dreams.set(d.id, d);
    return d;
  }
  async listByUser(userId: string): Promise<Dream[]> {
    return Array.from(dreams.values()).filter((d) => d.userId === userId).sort((a,b)=>+b.timestamp-+a.timestamp);
  }
  async getByIdOwned(userId: string, idv: string): Promise<Dream | null> {
    const d = dreams.get(idv);
    return d && d.userId === userId ? d : null;
  }
  async update(idv: string, patch: Partial<Dream>): Promise<Dream | null> {
    const d = dreams.get(idv);
    if (!d) return null;
    const nd = { ...d, ...patch } as Dream;
    dreams.set(idv, nd);
    return nd;
  }
}

export function createMemoryRepos(): Repos {
  return { users: new MemoryUserRepo(), dreams: new MemoryDreamRepo() };
}
