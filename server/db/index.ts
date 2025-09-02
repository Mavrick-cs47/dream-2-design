import { createMemoryRepos } from "./memory";
import { createMongoRepos } from "./mongo";
import type { Repos } from "./types";

let reposPromise: Promise<Repos> | null = null;

export function getRepos(): Promise<Repos> {
  if (!reposPromise) {
    const uri = process.env.MONGODB_URI;
    if (uri) {
      reposPromise = createMongoRepos(uri).catch((err) => {
        console.error("Mongo connection failed, falling back to memory:", err);
        return createMemoryRepos();
      });
    } else {
      console.warn("MONGODB_URI not set. Using in-memory store (non-persistent).");
      reposPromise = Promise.resolve(createMemoryRepos());
    }
  }
  return reposPromise;
}
