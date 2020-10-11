// process.argv[0] = path to node binary
// process.argv[1] = path to script
// process.argv[3] = pact-broker hostname
// process.argv[2] = version

let projectFolder = __dirname;
let pact = require('@pact-foundation/pact-node');

let options = {
  pactFilesOrDirs: [projectFolder + '/pacts'],
  pactBroker: process.argv[3],
  consumerVersion: process.argv[2],
  tags: ['build']
};

pact.publishPacts(options).then(() => {
  console.log("Pacts successfully published!");
  return 0;
}).catch(() => {
  console.log("Error publishing Pacts");
  return 1;
});
