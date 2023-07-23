
function drawGradientRect(_x, _y, _w, _h, _mainHue, _mainSat, _mainBri, _seed, _targetGraphic) {
    randomSeed(_seed);
    _targetGraphic.colorMode(HSB);

    let hueA = processHue(_mainHue);
    let satA = _mainSat;
    let briA = _mainBri;

    let hueB = processHue(_mainHue + random(30, 60));
    let satB = _mainSat + random(-10, 10);
    let briB = _mainBri + random(-10, 10);

    let isLeftRightGradient = random() < 0.5;

    let colorA = color(hueA, satA, briA);
    let colorB = color(hueB, satB, briB);

    if (isLeftRightGradient) {
        for (let x = 0; x < _w; x++) {
            let startX = _x + x;
            let startY = _y;

            let nowColor = NYLerpColor(colorA, colorB, x / _w);
            _targetGraphic.noStroke();
            _targetGraphic.fill(nowColor);
            _targetGraphic.rect(startX, startY, 1, _h);
        }
    }
    else {
        for (let y = 0; y < _h; y++) {
            let startX = _x;
            let startY = _y + y;

            let nowColor = NYLerpColor(colorA, colorB, y / _h);
            _targetGraphic.noStroke();
            _targetGraphic.fill(nowColor);
            _targetGraphic.rect(startX, startY, _w, 1);
        }
    }

    // drawFrame
    let frameThickness = min(_w, _h) * 0.01;

    if (frameThickness < 2)
        frameThickness = 2;

    // let frameBri = random(0, 10);
    // if (random() < 0.5)
    //     frameBri = 100 - frameBri;

    // if(random() < 0.1)
    //     frameBri = 100;

    let frameBri = 12;

    if (BLACK_FRAME)
        frameBri = 0;
    else
        frameBri = 100;

    _targetGraphic.fill(0, 0, frameBri);
    _targetGraphic.rect(_x, _y, _w, frameThickness);
    _targetGraphic.rect(_x, _y, frameThickness, _h);
    _targetGraphic.rect(_x + _w - frameThickness, _y, frameThickness, _h);
    _targetGraphic.rect(_x, _y + _h - frameThickness, _w, frameThickness);
}

// draw line rects
function drawStyledRect(_x, _y, _w, _h, _mainHue, _mainSat, _mainBri, _seed, _targetGraphic) {
    randomSeed(_seed);

    let xSlices = int(random(10, 60));
    let ySlices = int(random(10, 60));

    let sliceRandom = random();
    if (sliceRandom < 0.3)
        xSlices = 1;
    else if (sliceRandom < 0.6)
        ySlices = 1;

    let sliceWidth = _w / xSlices;
    let sliceHeight = _h / ySlices;

    for (let x = 0; x < xSlices; x++) {
        for (let y = 0; y < ySlices; y++) {

            let drawHue = processHue(_mainHue + random(-10, 10));

            let drawSat = _mainSat + random(-10, 10);
            let drawBri = _mainBri + random(-10, 10);

            let startX = _x + x * sliceWidth;
            let startY = _y + y * sliceHeight;
            _targetGraphic.noStroke();
            _targetGraphic.fill(drawHue, drawSat, drawBri);
            _targetGraphic.rect(startX, startY, sliceWidth, sliceHeight);
        }
    }

    // drawFrame
    let frameThickness = 2;

    // let frameBri = random(0, 10);
    // if (random() < 0.5)
    //     frameBri = 100 - frameBri;

    // if(random() < 0.1)
    //     frameBri = 100;
    let frameBri = 100;

    _targetGraphic.fill(0, 0, frameBri);
    _targetGraphic.rect(_x, _y, _w, frameThickness);
    _targetGraphic.rect(_x, _y, frameThickness, _h);
    _targetGraphic.rect(_x + _w - frameThickness, _y, frameThickness, _h);
    _targetGraphic.rect(_x, _y + _h - frameThickness, _w, frameThickness);
}

function processHue(_hue) {
    let hue = _hue % 360;
    if (hue < 0)
        hue += 360;

    return hue;
}



// calculate angle between two points
function getAngleDegreeFromTop(_p1, _p2) {
    let dx = _p2.x - _p1.x;
    let dy = _p2.y - _p1.y;

    return Math.atan2(dy, dx) * 180 / Math.PI + 90;
}

function getMirrorPoint(_leftPoint, _rightPoint, _centerPoint) {
    let lineAngle = getAngleDegreeFromTop(_leftPoint, _rightPoint);
    let angleToCenter = getAngleDegreeFromTop(_leftPoint, _centerPoint);

    let angleDiff = lineAngle - angleToCenter;
    let finalAngle = lineAngle + angleDiff;

    let distToCenter = dist(_leftPoint.x, _leftPoint.y, _centerPoint.x, _centerPoint.y);

    let finalX = _leftPoint.x + distToCenter * sin(radians(finalAngle));
    let finalY = _leftPoint.y + distToCenter * -cos(radians(finalAngle));

    return new Point(finalX, finalY);
}

function NYLerpColor(_colorA, _colorB, _t) {
    let hueA = hue(_colorA);
    let hueB = hue(_colorB);

    let hueDiff = abs(hueB - hueA);

    if (abs((hueB - 360) - hueA) < hueDiff) {
        hueB -= 360;
    }
    else if (abs((hueB + 360) - hueA) < hueDiff) {
        hueB += 360;
    }
    else {
        return lerpColor(_colorA, _colorB, _t);
    }

    let satA = saturation(_colorA);
    let briA = brightness(_colorA);
    let alphaA = alpha(_colorA);

    let satB = saturation(_colorB);
    let briB = brightness(_colorB);
    let alphaB = alpha(_colorB);

    let resultHue = lerp(hueA, hueB, _t);
    let resultSat = lerp(satA, satB, _t);
    let resultBri = lerp(briA, briB, _t);
    let resultAlpha = lerp(alphaA, alphaB, _t);

    if (resultHue < 0) {
        resultHue += 360;
    }
    else if (resultHue > 360) {
        resultHue -= 360;
    }

    return color(resultHue, resultSat, resultBri, resultAlpha);
}