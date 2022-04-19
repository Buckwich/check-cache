import * as core from "@actions/core";
import * as path from "path";

import * as cacheUtils from "@actions/cache/lib/internal/cacheUtils";
import * as cacheHttpClient from "@actions/cache/lib/internal/cacheHttpClient";
import { DownloadOptions } from "@actions/cache/lib/options";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class ReserveCacheError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReserveCacheError";
    Object.setPrototypeOf(this, ReserveCacheError.prototype);
  }
}

function checkPaths(paths: string[]): void {
  if (!paths || paths.length === 0) {
    throw new ValidationError(
      `Path Validation Error: At least one directory or file path is required`
    );
  }
}

function checkKey(key: string): void {
  if (key.length > 512) {
    throw new ValidationError(
      `Key Validation Error: ${key} cannot be larger than 512 characters.`
    );
  }
  const regex = /^[^,]*$/;
  if (!regex.test(key)) {
    throw new ValidationError(
      `Key Validation Error: ${key} cannot contain commas.`
    );
  }
}

/**
 * Check id a cache for cach input is available
 *
 * @param primaryKey an explicit key for restoring the cache
 * @param restoreKeys an optional ordered list of keys to use for restoring the cache if no cache hit occurred for key
 * @returns string returns the key for the cache hit, otherwise returns undefined
 */
export async function checkCache(
  paths: string[],
  primaryKey: string,
  restoreKeys?: string[]
): Promise<string | undefined> {
  checkPaths(paths);
  restoreKeys = restoreKeys || [];
  const keys = [primaryKey, ...restoreKeys];

  core.debug("Resolved Keys:");
  core.debug(JSON.stringify(keys));

  if (keys.length > 10) {
    throw new ValidationError(
      `Key Validation Error: Keys are limited to a maximum of 10.`
    );
  }
  for (const key of keys) {
    checkKey(key);
  }

  const compressionMethod = await cacheUtils.getCompressionMethod();

  // path are needed to compute version
  const cacheEntry = await cacheHttpClient.getCacheEntry(keys, paths, {
    compressionMethod,
  });
  if (!cacheEntry?.archiveLocation) {
    // Cache not found
    return undefined;
  }

  const archivePath = path.join(
    await cacheUtils.createTempDirectory(),
    cacheUtils.getCacheFileName(compressionMethod)
  );
  core.debug(`Archive Path: ${archivePath}`);

  return cacheEntry.cacheKey;
}
