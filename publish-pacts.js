// process.argv[0] = path to node binary
// process.argv[1] = path to script
// process.argv[3] = pact-broker hostname
// process.argv[2] = version

let projectFolder = __dirname;
let pact = require('@pact-foundation/pact-node');
let consumerVersion = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString().trim();
let pactBroker = 'http://ip172-18-0-60-bvd3717p2ffg00f6oca0-9292.direct.labs.play-with-docker.com/';

if(process.argv.length === 4) {
  consumerVersion = process.argv[2];
  pactBroker = process.argv[3];
}
let folders = [];
const fs = require("fs"); // Or `import fs from "fs";` with ESM

if (fs.existsSync(projectFolder + '/pacts')) {
  folders.push(projectFolder + '/pacts');
}

if (fs.existsSync(projectFolder + '/apps/web-app/pacts')) {
  folders.push(projectFolder + '/apps/web-app/pacts');
}

console.log('pact broker: ' + pactBroker);
console.log('Consumer version: ' + consumerVersion);
console.log('pact locations: ' + folders);

let options = {
  pactFilesOrDirs: folders,
  pactBroker: pactBroker,
  consumerVersion: consumerVersion,
  tags: ['build']
};

pact.publishPacts(options).then(() => {
  console.log("Pacts successfully published!");
  return 0;
}).catch(() => {
  console.log("Error publishing Pacts");
  return 1;
});
