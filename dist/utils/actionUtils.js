"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCacheFeatureAvailable = exports.getInputAsArray = exports.isValidEvent = exports.logWarning = exports.isExactKeyMatch = exports.isGhes = void 0;
const cache_1 = require("@actions/cache");
const core = __importStar(require("@actions/core"));
const constants_1 = require("../constants");
function isGhes() {
    const ghUrl = new URL(process.env["GITHUB_SERVER_URL"] || "https://github.com");
    return ghUrl.hostname.toUpperCase() !== "GITHUB.COM";
}
exports.isGhes = isGhes;
function isExactKeyMatch(key, cacheKey) {
    return !!(cacheKey &&
        cacheKey.localeCompare(key, undefined, {
            sensitivity: "accent",
        }) === 0);
}
exports.isExactKeyMatch = isExactKeyMatch;
function logWarning(message) {
    const warningPrefix = "[warning]";
    core.info(`${warningPrefix}${message}`);
}
exports.logWarning = logWarning;
// Cache token authorized for all events that are tied to a ref
// See GitHub Context https://help.github.com/actions/automating-your-workflow-with-github-actions/contexts-and-expression-syntax-for-github-actions#github-context
function isValidEvent() {
    return constants_1.RefKey in process.env && Boolean(process.env[constants_1.RefKey]);
}
exports.isValidEvent = isValidEvent;
function getInputAsArray(name, options) {
    return core
        .getInput(name, options)
        .split("\n")
        .map((s) => s.trim())
        .filter((x) => x !== "");
}
exports.getInputAsArray = getInputAsArray;
function isCacheFeatureAvailable() {
    if (!(0, cache_1.isFeatureAvailable)()) {
        if (isGhes()) {
            logWarning("Cache action is only supported on GHES version >= 3.5. If you are on version >=3.5 Please check with GHES admin if Actions cache service is enabled or not.");
        }
        else {
            logWarning("An internal error has occurred in cache backend. Please check https://www.githubstatus.com/ for any ongoing issue in actions.");
        }
        return false;
    }
    return true;
}
exports.isCacheFeatureAvailable = isCacheFeatureAvailable;
