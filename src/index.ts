import { ValidationError } from "@actions/cache";
import * as core from "@actions/core";
import { checkCache } from "./check-cache";

import { Inputs, Outputs } from "./constants";
import * as utils from "./utils/actionUtils";

async function run(): Promise<void> {
  try {
    if (!utils.isCacheFeatureAvailable()) {
      core.setOutput(Outputs.CacheHit, "false");
      return;
    }

    // Validate inputs, this can cause task failure
    if (!utils.isValidEvent()) {
      utils.logWarning(
        `Event Validation Error: This event type is not supported because it's not tied to a branch or tag ref.`
      );
      return;
    }

    const primaryKey = core.getInput(Inputs.Key, { required: true });

    const restoreKeys = utils.getInputAsArray(Inputs.RestoreKeys);
    const cachePaths = utils.getInputAsArray(Inputs.Path, {
      required: true,
    });

    try {
      const cacheKey = await checkCache(cachePaths, primaryKey, restoreKeys);
      if (!cacheKey) {
        core.info(
          `Cache not found for input keys: ${[primaryKey, ...restoreKeys].join(
            ", "
          )}`
        );
        return;
      }

      core.setOutput(Outputs.CacheKey, cacheKey);
      core.setOutput(Outputs.CacheHit, "true");

      const isExactKeyMatch = utils.isExactKeyMatch(primaryKey, cacheKey);
      core.setOutput(Outputs.ExactHit, isExactKeyMatch.toString());
    } catch (error: any) {
      if (error.name === ValidationError.name) {
        throw error;
      } else {
        utils.logWarning(error.message);
        core.setOutput(Outputs.CacheHit, "false");
      }
    }
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();

export default run;
