let FRAME_AWAIT_TIME = 10;

let _frontLayer;
let _backLayer;
let _cardGraphicDisplayLayer;

let _imgA;
let _imgB;

// prepare cards' visual on this graphic
let _cardFrontGraphic;
let _cardBackGraphic;

// global use for drawing cards
let _tempCardImgA;
let _tempCardImgB;

let BLACK_FRAME = false;

function preload() {
  _imgA = loadImage('test-1.png');
  _imgB = loadImage('test-2.png');
}

async function setup() {
  createCanvas(windowWidth, windowHeight);

  _frontLayer = createGraphics(width, height);
  _backLayer = createGraphics(width, height);
  _cardGraphicDisplayLayer = createGraphics(width, height);

  _cardFrontGraphic = createGraphics(width, height);
  _cardBackGraphic = createGraphics(width, height);
  _cardFrontGraphic.colorMode(HSB);
  _cardBackGraphic.colorMode(HSB);

  _tempCardImgA = createGraphics(width, height);
  _tempCardImgB = createGraphics(width, height);

  colorMode(HSB);
  background(0, 0, 6);

  // traits
  let _mainHue = random(0, 360);

  // generate rect & card datas
  let padding = 30;
  let areaX = padding;
  let areaY = padding;
  let areaW = width - padding * 2;
  let areaH = height - padding * 2;

  let cards = [];
  let rectDatas = subdivideRect(areaX, areaY, areaW, areaH);
  rectDatas.sort((a, b) => {
    let sizeA = a.w * a.h;
    let sizeB = b.w * b.h;

    if (sizeA < sizeB)
      return -1;
    else if (sizeA > sizeB)
      return 1;
    else
      return 0;
  });

  for (let i = 0; i < rectDatas.length; i++) {
    cards[i] = new Card(rectDatas[i].x, rectDatas[i].y, rectDatas[i].w, rectDatas[i].h);
    cards[i].cardHue = processHue(_mainHue + random(-30, 30));
    cards[i].cardSat = random(40, 60);
    cards[i].cardBri = random(80, 100);

    let colorRandom = random();

    if (colorRandom < 0.12) {
      cards[i].cardHue += 60;
    }
    else if (colorRandom < 0.24) {
      cards[i].cardHue += 180;
    }

  }

  // draw card graphics
  for (let i = 0; i < rectDatas.length; i++) {
    let cardHue = cards[i].cardHue;
    let cardSat = cards[i].cardSat;
    let cardBri = cards[i].cardBri;

    let _x = rectDatas[i].x;
    let _y = rectDatas[i].y;
    let _w = rectDatas[i].w;
    let _h = rectDatas[i].h;
    let _hue = cardHue;
    let _sat = cardSat;
    let _bri = cardBri;
    let _seed = cards[i].seed;

    let _hueBack = processHue(_hue + 180);
    let _satBack = _sat - 40;
    let _briBack = _bri - 30;

    drawGradientRect(_x, _y, _w, _h, _hue, _sat, _bri, _seed, _cardFrontGraphic);

    // drawStyledRect(_x, _y, _w, _h, _hue, _sat, _bri, _seed, _cardFrontGraphic);
    // drawStyledRect(_x, _y, _w, _h, _hueBack, _sat, _bri, _seed, _cardBackGraphic);
    // drawStyledRect(_x, _y, _w, _h, _hue, _sat, _briBack, _seed, _cardBackGraphic);
    let backTypeRandom = random();

    if (backTypeRandom < 0.25)
      drawGradientRect(_x, _y, _w, _h, _hueBack, _sat, _bri, _seed, _cardBackGraphic);
    else if (backTypeRandom < 0.5)
      drawGradientRect(_x, _y, _w, _h, _hue, _satBack, _bri, _seed, _cardBackGraphic);
    else if (backTypeRandom < 0.75)
      drawGradientRect(_x, _y, _w, _h, _hue, _sat, _briBack, _seed, _cardBackGraphic);
    else
      drawGradientRect(_x, _y, _w, _h, _hue, 100, _bri, _seed, _cardBackGraphic);


    background(0, 0, 6);
    image(_cardFrontGraphic, 0, 0);
    await sleep(FRAME_AWAIT_TIME);
  }

  // draw on graphic display
  _cardGraphicDisplayLayer.image(_cardFrontGraphic, 0, 0);

  // // remove
  // for (let i = 0; i < rectDatas.length; i++) {
  //   _cardGraphicDisplayLayer.erase();
  //   _cardGraphicDisplayLayer.rect(rectDatas[i].x, rectDatas[i].y, rectDatas[i].w, rectDatas[i].h);
  //   _cardGraphicDisplayLayer.noErase();

  //   cards[i].getCardGraphic();
  //   cards[i].drawFront();

  //   background(0, 0, 6);
  //   image(_cardGraphicDisplayLayer, 0, 0);
  //   image(_frontLayer, 0, 0);
  //   // rect(rectDatas[i].x, rectDatas[i].y, rectDatas[i].w, rectDatas[i].h);
  //   await sleep(FRAME_AWAIT_TIME);
  // }

  // // fold after
  for (let i = 0; i < cards.length; i++) {
    _cardGraphicDisplayLayer.erase();
    _cardGraphicDisplayLayer.rect(rectDatas[i].x, rectDatas[i].y, rectDatas[i].w, rectDatas[i].h);
    _cardGraphicDisplayLayer.noErase();

    cards[i].getCardGraphic();
    cards[i].drawFront();

    cards[i].cropCard(random(0.2, 0.8), random(0.2, 0.8));
    cards[i].removeCroppedFront();
    cards[i].drawBack();

    background(0, 0, 6);
    image(_cardGraphicDisplayLayer, 0, 0);
    image(_frontLayer, 0, 0);
    image(_backLayer, 0, 0);
    await sleep(30);
  }
}

function subdivideRect(_x, _y, _w, _h) {
  let isSplit = random() < 0.9;

  if (_w < 80 || _h < 80)
    isSplit = false;

  if (isSplit) {
    let splitRatio = random(0.2, 0.8);
    let isSplitLeftRight = (_w > _h);

    // split left right
    if (isSplitLeftRight) {
      let rectAs = subdivideRect(_x, _y, _w * splitRatio, _h);
      let rectBs = subdivideRect(_x + _w * splitRatio, _y, _w * (1 - splitRatio), _h);
      return rectAs.concat(rectBs);
    }
    // split top bottom
    else {
      let rectAs = subdivideRect(_x, _y, _w, _h * splitRatio);
      let rectBs = subdivideRect(_x, _y + _h * splitRatio, _w, _h * (1 - splitRatio));
      return rectAs.concat(rectBs);
    }
  }
  else {
    return [new RectData(_x, _y, _w, _h)];
  }

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}