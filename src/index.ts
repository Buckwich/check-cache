import { setOutput } from "@actions/core";

console.log("hello world");

setOutput("cache-key", "fake-test-key");
setOutput("cache-hit", false);
setOutput("exact-hit", true);
