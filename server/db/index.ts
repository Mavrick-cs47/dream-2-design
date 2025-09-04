import { createMemoryRepos } from "./memory";
import type { Repos } from "./types";
import { createMemoryRepos } from "./memory";

let reposPromise: Promise<Repos> | null = null;

export function getRepos(): Promise<Repos> {
  if (!reposPromise) {
    // Force in-memory store for simplicity (no MongoDB required)
    reposPromise = Promise.resolve(createMemoryRepos());
  }
  return reposPromise;
}
