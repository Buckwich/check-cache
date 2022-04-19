"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefKey = exports.Outputs = exports.Inputs = void 0;
var Inputs;
(function (Inputs) {
    Inputs["Path"] = "path";
    Inputs["Key"] = "key";
    Inputs["RestoreKeys"] = "restore-keys";
})(Inputs = exports.Inputs || (exports.Inputs = {}));
var Outputs;
(function (Outputs) {
    Outputs["CacheKey"] = "cache-key";
    Outputs["CacheHit"] = "cache-hit";
    Outputs["ExactHit"] = "exact-hit";
})(Outputs = exports.Outputs || (exports.Outputs = {}));
exports.RefKey = "GITHUB_REF";
