import fs from "node:fs";
const spec = JSON.parse(fs.readFileSync("/tmp/tatoeba-openapi.json", "utf8"));
const path = spec.paths?.["/v1/sentences"];
console.log(JSON.stringify({ get: path?.get, parameters: path?.get?.parameters }, null, 2));
