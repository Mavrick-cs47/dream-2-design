import { createMemoryRepos } from "./memory";
import type { Repos } from "./types";

let reposPromise: Promise<Repos> | null = null;

export function getRepos(): Promise<Repos> {
  if (!reposPromise) {
    // Force in-memory store for simplicity (no MongoDB required)
    reposPromise = import("./memory").then(({ createMemoryRepos }) => createMemoryRepos());
  }
  return reposPromise;
}
