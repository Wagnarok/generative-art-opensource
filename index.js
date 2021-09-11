const fs = require('fs');
const { createCanvas, loadImage, Image } = require('canvas');
const {
  width,
  height,
  description,
  baseImageUri,
  editionSize,
  startEditionFrom,
  endEditionAt,
  raceWeights,
} = require('./input/config.js');
const { gupiAttrib } = require('./input/gupiAttributes.js');
const console = require('console');
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
var metadataList = [];
var attributesList = [];
var dnaList = [];

const saveImage = (_editionCount, _svgString) => {
  fs.writeFileSync(`./output/${_editionCount}.svg`, _svgString);
};

// const signImage = (_sig) => {
//   ctx.fillStyle = '#ffffff';
//   ctx.font = 'bold 30pt Verdana';
//   ctx.textBaseline = 'top';
//   ctx.textAlign = 'left';
//   ctx.fillText(_sig, 40, 40);
// };

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, 85%)`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = genColor();
  ctx.fillRect(0, 0, width, height);
};

const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    dna: _dna.join(''),
    name: `#${_edition}`,
    description: description,
    image: `${baseImageUri}/${_edition}.png`,
    edition: _edition,
    date: dateTime,
    attributes: attributesList,
  };
  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element) => {
  _element.forEach((layer) => {
    let selectedElement = layer.selectedElement;
    attributesList.push({
      trait_type: layer.name,
      value: selectedElement.name,
    });
    console.log(attributesList);
  });
};

const loadLayerImg = async (_layer) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(`${_layer.selectedElement.path}`);
    resolve({ layer: _layer, loadedImage: svg });
  });
};

const drawElement = (_element) => {
  let img1 = new Image();
  img1.onload = function () {
    ctx.drawImage(
      img1

      // _element.layer.size.width,
      // _element.layer.size.height
    );
  };
  img1.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(_element);

  //addAttributes(_element);
};

const constructLayerToDna = (_dna = [], _races = [], _race) => {
  let mappedDnaToLayers = _races[_race].layers.map((layer, index) => {
    let selectedElement = layer.elements.find((e) => e.id == _dna[index]);
    return {
      name: layer.name,
      // position: layer.position,
      // size: layer.size,
      selectedElement: selectedElement,
    };
  });

  return mappedDnaToLayers;
};

const getRace = (_editionCount) => {
  let race = 'No Race';
  raceWeights.forEach((raceWeight) => {
    if (_editionCount >= raceWeight.from && _editionCount <= raceWeight.to) {
      race = raceWeight.value;
    }
  });
  return race;
};

const isDnaUnique = (_DnaList = [], _dna = []) => {
  let foundDna = _DnaList.find((i) => i.join('') === _dna.join(''));
  return foundDna == undefined ? true : false;
};

const createDna = (_races, _race) => {
  let randNum = [];
  _races[_race].layers.forEach((layer) => {
    let randElementNum = Math.floor(Math.random() * 100);
    let num = 0;
    layer.elements.forEach((element) => {
      if (randElementNum >= 100 - element.weight) {
        num = element.id;
      }
    });
    randNum.push(num);
  });
  console.log(randNum);
  return randNum;
};

const writeMetaData = (_data) => {
  fs.writeFileSync('./output/_metadata.json', _data);
};

const saveMetaDataSingleFile = (_editionCount) => {
  fs.writeFileSync(
    `./output/${_editionCount}.json`,
    JSON.stringify(metadataList.find((meta) => meta.edition == _editionCount))
  );
};

const startCreating = async () => {
  writeMetaData('');
  let editionCount = startEditionFrom;
  while (editionCount <= endEditionAt) {
    let race = getRace(editionCount);
    let newDna = createDna(gupiAttrib, race);

    if (isDnaUnique(dnaList, newDna)) {
      let results = constructLayerToDna(newDna, gupiAttrib, race);
      //console.log(results);
      let loadedElements = []; //promise array
      results.forEach((layer) => {
        loadedElements.push(layer.selectedElement);
      });

      await Promise.all(loadedElements).then(() => {
        //console.log(loadedElements);
        let svgString = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500">
  <defs>
    <style>
      .cls-1 {
        fill: none;
      }

      .cls-2 {
        clip-path: url(#clip-path);
      }

      .cls-3 {
        fill: url(#RadRed);
      }

      .cls-4 {
        fill: url(#RadSimpleGreen);
      }

      .cls-5 {
        fill: #1a1a1a;
      }
    </style>
    <clipPath id="clip-path">
      ${loadedElements[0].svg}
    </clipPath>
    <radialGradient id="RadRed" cx="196.37" cy="248.83" r="188.23" gradientUnits="userSpaceOnUse">
      <stop offset="0.02" stop-color="#333"/>
      <stop offset="0.1" stop-color="#453132"/>
      <stop offset="0.24" stop-color="#732b2e"/>
      <stop offset="0.43" stop-color="#be2228"/>
      <stop offset="0.55" stop-color="#ed1c24"/>
      <stop offset="0.6" stop-color="#e51c24"/>
      <stop offset="0.66" stop-color="#cf1c23"/>
      <stop offset="0.75" stop-color="#aa1b21"/>
      <stop offset="0.85" stop-color="#781b1e"/>
      <stop offset="0.95" stop-color="#381a1b"/>
      <stop offset="1" stop-color="#1a1a1a"/>
    </radialGradient>
    <radialGradient id="RadSimpleGreen" cx="196.37" cy="248.83" r="188.23" gradientUnits="userSpaceOnUse">
      <stop offset="0.02" stop-color="#1e3f1c"/>
      <stop offset="0.13" stop-color="#215123"/>
      <stop offset="0.34" stop-color="#287f35"/>
      <stop offset="0.55" stop-color="#30b44a"/>
      <stop offset="0.7" stop-color="#38b549"/>
      <stop offset="0.92" stop-color="#4eb848"/>
      <stop offset="1" stop-color="#57b947"/>
    </radialGradient>
  </defs>
  <g id="tail">
    <g class="cls-2">
      <g id="tailColor">
        <ellipse id="TailColor-2" data-name="TailColor" class="cls-3" cx="196.37" cy="248.83" rx="183.06" ry="193.25"/>
      </g>
      
      ${loadedElements[1].svg}
      
    </g>
  </g>
</svg>`;

        // ctx.clearRect(0, 0, width, height);
        // drawBackground();
        // elementArray.forEach((element) => {
        drawElement(svgString);
        // });
        //signImage(`#${editionCount}`);
        addAttributes(results);
        saveImage(editionCount, svgString);
        addMetadata(newDna, editionCount);
        saveMetaDataSingleFile(editionCount);
        console.log(
          `Created edition: ${editionCount}, Race: ${race} with DNA: ${newDna}`
        );
      });
      dnaList.push(newDna);
      editionCount++;
    } else {
      console.log('DNA exists!');
    }
  }
  writeMetaData(JSON.stringify(metadataList));
};

startCreating();
