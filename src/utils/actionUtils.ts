import { isFeatureAvailable } from "@actions/cache";
import * as core from "@actions/core";

import { Outputs, RefKey } from "../constants";

export function isGhes(): boolean {
  const ghUrl = new URL(
    process.env["GITHUB_SERVER_URL"] || "https://github.com"
  );
  return ghUrl.hostname.toUpperCase() !== "GITHUB.COM";
}

export function isExactKeyMatch(key: string, cacheKey?: string): boolean {
  return !!(
    cacheKey &&
    cacheKey.localeCompare(key, undefined, {
      sensitivity: "accent",
    }) === 0
  );
}

export function logWarning(message: string): void {
  const warningPrefix = "[warning]";
  core.info(`${warningPrefix}${message}`);
}

// Cache token authorized for all events that are tied to a ref
// See GitHub Context https://help.github.com/actions/automating-your-workflow-with-github-actions/contexts-and-expression-syntax-for-github-actions#github-context
export function isValidEvent(): boolean {
  return RefKey in process.env && Boolean(process.env[RefKey]);
}

export function getInputAsArray(
  name: string,
  options?: core.InputOptions
): string[] {
  return core
    .getInput(name, options)
    .split("\n")
    .map((s) => s.trim())
    .filter((x) => x !== "");
}

export function isCacheFeatureAvailable(): boolean {
  if (!isFeatureAvailable()) {
    if (isGhes()) {
      logWarning(
        "Cache action is only supported on GHES version >= 3.5. If you are on version >=3.5 Please check with GHES admin if Actions cache service is enabled or not."
      );
    } else {
      logWarning(
        "An internal error has occurred in cache backend. Please check https://www.githubstatus.com/ for any ongoing issue in actions."
      );
    }
    return false;
  }

  return true;
}
