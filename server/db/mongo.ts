import type { Repos } from "./types";
import { createMemoryRepos } from "./memory";

// MongoDB disabled for this deployment. Delegate to in-memory repos.
export async function createMongoRepos(_uri: string): Promise<Repos> {
  return createMemoryRepos();
}
