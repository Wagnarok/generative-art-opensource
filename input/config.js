const fs = require('fs');
const width = 500;
const height = 500;

const description = 'Project Gupi';
const baseImageUri = 'https://nft';
const startEditionFrom = 1;
const endEditionAt = 3;
const editionSize = 3;
const raceWeights = [
  {
    value: 'gupi',
    from: 1,
    to: editionSize,
  },
];

module.exports = {
  width,
  height,
  description,
  baseImageUri,
  editionSize,
  startEditionFrom,
  endEditionAt,
  raceWeights,
};
