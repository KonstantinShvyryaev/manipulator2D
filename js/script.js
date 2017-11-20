$(document).ready(function () {
    var canvas = $('.canvas')[0];
    var context = canvas.getContext('2d');
    var rotationOfFirstBeam;
    var rotationOfSecondBeam;

    /* resize the canvas */
    resizeCanvas();

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Main function for any animations 
        anyActions(canvas, context, rotationOfFirstBeam, rotationOfSecondBeam);
    }
    // Resize the canvas to fill browser window dynamically
    $(window).on("resize", function () {
        resizeCanvas();
    });
    /* resize the canvas */
});

/* Main function for any animations */
function anyActions(canvas, context, rotationOfFirstBeam, rotationOfSecondBeam) {
    var centerOfWidth = window.innerWidth / 2;
    var centerOfHeight = window.innerHeight / 2;
    var navbarHeight = $("#navbar").height();
    /*var footerHeight = $("#footer").height();*/
    var systemIndent = 10;
    var beamWidth = 10;
    var radius = calculateRadius(centerOfWidth, centerOfHeight, navbarHeight, systemIndent);
    // The last position of the canvas
    var lastCanvasWidth = canvas.width;
    var lastCanvasHeight = canvas.height;
    // Parameters for function which is called drawCanvas
    var canvasParams = [canvas, context, centerOfWidth, centerOfHeight, 
        navbarHeight, radius, systemIndent, lastCanvasWidth, lastCanvasHeight];
    // [angleA, angleB]
    var angles = [Number($("#angleA").val()), Number($("#angleB").val())];
    // [xCoord, yCoord]
    var coords = [Number($("#xCoord").val()), Number($("#yCoord").val())];


    /* Load standard size of beams one times */
    beamsSettingCSS(radius, beamWidth, Number($("#dirLengthA").val()),
        Number($("#dirLengthB").val()));
    /* Move the beams to the standard position and
     * setting of canvas  to standard position one times */
    rotatingBeams(rotationOfFirstBeam, rotationOfSecondBeam, canvasParams, 
        angles, coords, 0);
    /* Processing of fields */
    fieldsHandler(radius, beamWidth, canvasParams);
    /* Processing of buttons */
    buttonsHandler(rotationOfFirstBeam, rotationOfSecondBeam, canvasParams);
}

/* Function of to calculate radius */
function calculateRadius(centerOfWidth, centerOfHeight, navbarHeight, systemIndent) {
    if (centerOfWidth > centerOfHeight) {
        var radius = Math.floor((centerOfHeight - navbarHeight - systemIndent) / 10) * 10;
    } else {
        var radius = Math.floor((centerOfWidth - navbarHeight - systemIndent) / 10) * 10;
    }
    return radius;
}

/* Canvas */
function drawCanvas(canvasParams) {
    var arrowIndent = 5;
    var canvas = canvasParams[0];
    var context = canvasParams[1];
    var centerOfWidth = canvasParams[2];
    var centerOfHeight = canvasParams[3];
    var navbarHeight = canvasParams[4];
    var radius = canvasParams[5];
    var systemIndent = canvasParams[6];

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    /* Drawing a Grid */
    context.beginPath();
    for (var x = centerOfWidth + 0.5; x < window.innerWidth; x += 10) {
        context.moveTo(x, 0);
        context.lineTo(x, window.innerHeight);
    }
    for (var x = centerOfWidth - 10 + 0.5; x > 0; x -= 10) {
        context.moveTo(x, 0);
        context.lineTo(x, window.innerHeight);
    }
    for (var y = centerOfHeight + 0.5; y < window.innerHeight; y += 10) {
        context.moveTo(0, y);
        context.lineTo(window.innerWidth, y);
    }
    for (var y = centerOfHeight - 10 + 0.5; y > 0; y -= 10) {
        context.moveTo(0, y);
        context.lineTo(window.innerWidth, y);
    }
    context.strokeStyle = "#eee";
    context.stroke();
    context.closePath();

    /* Drawing a coordinate system */
    context.beginPath();
    context.moveTo(centerOfWidth, centerOfHeight + radius);
    context.lineTo(centerOfWidth, centerOfHeight - radius);
    context.lineTo(centerOfWidth - arrowIndent, centerOfHeight - radius + arrowIndent);
    context.moveTo(centerOfWidth, centerOfHeight - radius);
    context.lineTo(centerOfWidth + arrowIndent, centerOfHeight - radius + arrowIndent);
    context.moveTo(centerOfWidth - radius, centerOfHeight);
    context.lineTo(centerOfWidth + radius, centerOfHeight);
    context.lineTo(centerOfWidth + radius - arrowIndent, centerOfHeight - arrowIndent);
    context.moveTo(centerOfWidth + radius, centerOfHeight);
    context.lineTo(centerOfWidth + radius - arrowIndent, centerOfHeight + arrowIndent);
    context.strokeStyle = "#000";
    context.stroke();
    context.closePath();

    /* Drawing a circle */
    context.beginPath();
    context.arc(centerOfWidth, centerOfHeight, radius, 0, Math.PI * 2, false);
    context.strokeStyle = "rgb(0,113,114)";
    context.stroke();
    context.closePath();
}

/* Processing of fields */
function fieldsHandler(radius, beamWidth, canvasParams) {
    // Last positions of coordinates
    var xCoordLast = Number($("#xCoord").val());
    var yCoordLast = Number($("#yCoord").val());
    // Processing of field dirLengthA
    $("#dirLengthA").on("input keyup", function (event) {
        var dirLengthA = Number($("#dirLengthA").val());
        var dirLengthB = Number($("#dirLengthB").val());

        // If dirLengthA less than 0.001
        dirLengthA = ifLessThan(dirLengthA, "#dirLengthA", 0.001);
        $("#invLengthA").val(dirLengthA);

        // Setting of CSS of beams 
        beamsSettingCSS(radius, beamWidth, dirLengthA, dirLengthB);
        // Recalculate values of x and y coords
        changingCoords(yCoordLast);
        // Updating last coords
        xCoordLast = Number($("#xCoord").val());
        yCoordLast = Number($("#yCoord").val());

        // Updating positions of canvas
        drawCanvas(canvasParams);
    });
    // Processing of field invLengthA
    $("#invLengthA").on("input keyup", function (event) {
        var invLengthA = Number($("#invLengthA").val());
        var invLengthB = Number($("#invLengthB").val());

        // If invLengthA less than 0.001
        invLengthA = ifLessThan(invLengthA, "#invLengthA", 0.001);
        $("#dirLengthA").val(invLengthA);

        // Setting of CSS of beams 
        beamsSettingCSS(radius, beamWidth, invLengthA, invLengthB);
        // Recalculate values of x and y coords
        changingCoords(yCoordLast);
        // Updating last coords
        xCoordLast = Number($("#xCoord").val());
        yCoordLast = Number($("#yCoord").val());
        
        // Updating positions of canvas
        drawCanvas(canvasParams);
    });
    // Processing of field dirLengthB
    $("#dirLengthB").on("input keyup", function (event) {
        var dirLengthB = Number($("#dirLengthB").val());
        var dirLengthA = Number($("#dirLengthA").val());

        // If dirLengthB less than 0.001
        dirLengthB = ifLessThan(dirLengthB, "#dirLengthB", 0.001);
        $("#invLengthB").val(dirLengthB);

        // Setting of CSS of beams 
        beamsSettingCSS(radius, beamWidth, dirLengthA, dirLengthB);
        // Recalculate values of x and y coords
        changingCoords(yCoordLast);
        // Updating last coords
        xCoordLast = Number($("#xCoord").val());
        yCoordLast = Number($("#yCoord").val());

        // Updating positions of canvas
        drawCanvas(canvasParams);
    });
    // Processing of field invLengthB
    $("#invLengthB").on("input keyup", function (event) {
        var invLengthB = Number($("#invLengthB").val());
        var invLengthA = Number($("#invLengthA").val());

        // If invLengthB less than 0.001
        invLengthB = ifLessThan(invLengthB, "#invLengthB", 0.001);
        $("#dirLengthB").val(invLengthB);

        // Setting of CSS of beams 
        beamsSettingCSS(radius, beamWidth, invLengthA, invLengthB);
        // Recalculate values of x and y coords
        changingCoords(yCoordLast);
        // Updating last coords
        xCoordLast = Number($("#xCoord").val());
        yCoordLast = Number($("#yCoord").val());

        // Updating positions of canvas
        drawCanvas(canvasParams);
    });
    // Processing of field angleA
    $("#angleA").on("input keyup", function (event) {
        var angleA = Number($("#angleA").val());

        // If angleA less than 0
        ifLessThan(angleA, "#angleA", 0);
        // If angleA more than 359
        ifMoreThan(angleA, "#angleA", 359);
    });
    // Processing of field angleB
    $("#angleB").on("input keyup", function (event) {
        var angleB = Number($("#angleB").val());

        // If angleB less than 0
        ifLessThan(angleB, "#angleB", 0);
        // If angleB more than 359
        ifMoreThan(angleB, "#angleB", 359);
    });
    // Processing of field xCoord
    $("#xCoord").on("input keyup", function (event) {
        var lengthA = Number($("#invLengthA").val());
        var lengthB = Number($("#invLengthB").val());
        var xCoord = Number($("#xCoord").val());
        var yCoord = Number($("#yCoord").val());
        var min = -(lengthA + lengthB);
        var max = lengthA + lengthB;
        var centerLimit = Math.abs(lengthA - lengthB);
        var radiusInScale = lengthA + lengthB;

        // If the xCoord does not fall into the region
        if (xCoord < min) {
            $("#xCoord").val(min);
        } else if (xCoord > max) {
            $("#xCoord").val(max);
        }
        xCoord = Number($("#xCoord").val());

        // If the yCoord does not fall into the region
        var xCoordSquare = Math.pow(xCoord, 2);
        var ySquareSquare = Math.pow(yCoord, 2);
        var radiusInScaleSquare = Math.pow(radiusInScale, 2);
        var centerLimitSquare = Math.pow(centerLimit, 2);
        if (xCoordSquare + ySquareSquare > radiusInScaleSquare) {
            var new_yCoord = roundingOff(Math.sqrt(radiusInScaleSquare - xCoordSquare) - 0.004);
            if (yCoordLast < 0) {
                new_yCoord *= -1;
            }
            $("#yCoord").val(new_yCoord);
        } else if (xCoordSquare + ySquareSquare <= centerLimitSquare) {
            var new_yCoord = roundingOff(Math.sqrt(centerLimitSquare - xCoordSquare) + 0.004);
            if (yCoordLast < 0) {
                new_yCoord *= -1;
            }
            $("#yCoord").val(new_yCoord);
        }
        // Updating last coords
        xCoordLast = Number($("#xCoord").val());
        yCoordLast = Number($("#yCoord").val());
    });
    // Processing of field yCoord
    $("#yCoord").on("input keyup", function (event) {
        var lengthA = Number($("#invLengthA").val());
        var lengthB = Number($("#invLengthB").val());
        var xCoord = Number($("#xCoord").val());
        var yCoord = Number($("#yCoord").val());
        var min = -(lengthA + lengthB);
        var max = lengthA + lengthB;
        var centerLimit = Math.abs(lengthA - lengthB);
        var radiusInScale = lengthA + lengthB;

        // If the yCoord does not fall into the region
        if (yCoord < min) {
            $("#yCoord").val(min);
        } else if (yCoord > max) {
            $("#yCoord").val(max);
        }
        yCoord = Number($("#yCoord").val());

        // If the xCoord does not fall into the region
        var xCoordSquare = Math.pow(xCoord, 2);
        var ySquareSquare = Math.pow(yCoord, 2);
        var radiusInScaleSquare = Math.pow(radiusInScale, 2);
        var centerLimitSquare = Math.pow(centerLimit, 2);
        if (xCoordSquare + ySquareSquare > radiusInScaleSquare) {
            var new_xCoord = roundingOff(Math.sqrt(radiusInScaleSquare - ySquareSquare) - 0.004);
            if (xCoordLast < 0) {
                new_xCoord *= -1;
            }
            $("#xCoord").val(new_xCoord);
        } else if (xCoordSquare + ySquareSquare <= centerLimitSquare) {
            var new_xCoord = roundingOff(Math.sqrt(centerLimitSquare - ySquareSquare) + 0.004);
            if (xCoordLast < 0) {
                new_xCoord *= -1;
            }
            $("#xCoord").val(new_xCoord);
        }
        // Updating last coords
        xCoordLast = Number($("#xCoord").val());
        yCoordLast = Number($("#yCoord").val());
    });
}

/* Function which return value which not more than something value */
function ifLessThan(length, nameOfLength, min) {
    if (length < min) {
        $(nameOfLength).val(min);
    }
    length = Number($(nameOfLength).val());

    return length;
}

/* Function which return value which not more than something value */
function ifMoreThan(length, nameOfLength, max) {
    if (length > max) {
        $(nameOfLength).val(max);
    }
    length = Number($(nameOfLength).val());

    return length;
}

/* Setting of CSS of beams */
function beamsSettingCSS(radius, beamWidth, lengthA, lengthB) {
    var sumLength = lengthA + lengthB;
    var width_1 = radius * lengthA / sumLength;
    var width_2 = radius * lengthB / sumLength;
    /* CSS settings of Anime.js */
    $(".animeObject-1").css({
        "width": width_1,
        "height": beamWidth,
        "border-radius": beamWidth,
        "margin-right": width_1,
    });
    $(".animeObject-12").css({
        "margin-right": 2 * width_1,
    });
    $(".animeObject-2").css({
        "width": width_2,
        "height": beamWidth,
        "border-radius": beamWidth,
        "margin-right": width_2,
    });
}

/* Function of recalculate values of x and y coords */
function changingCoords(yCoordLast) {
    var lengthA = Number($("#invLengthA").val());
    var lengthB = Number($("#invLengthB").val());
    var xCoord = Number($("#xCoord").val());
    var yCoord = Number($("#yCoord").val());
    var min = -(lengthA + lengthB);
    var max = lengthA + lengthB;
    var centerLimit = Math.abs(lengthA - lengthB);
    var radiusInScale = lengthA + lengthB;

    // If the xCoord does not fall into the region
    if (xCoord < min) {
        $("#xCoord").val(min);
    } else if (xCoord > max) {
        $("#xCoord").val(max);
    }
    xCoord = Number($("#xCoord").val());

    // If the yCoord does not fall into the region
    var xCoordSquare = Math.pow(xCoord, 2);
    var ySquareSquare = Math.pow(yCoord, 2);
    var radiusInScaleSquare = Math.pow(radiusInScale, 2);
    var centerLimitSquare = Math.pow(centerLimit, 2);
    if (xCoordSquare + ySquareSquare > radiusInScaleSquare) {
        var new_yCoord = roundingOff(Math.sqrt(radiusInScaleSquare - xCoordSquare) - 0.004);
        if (yCoordLast < 0) {
            new_yCoord *= -1;
        }
        $("#yCoord").val(new_yCoord);
    } else if (xCoordSquare + ySquareSquare <= centerLimitSquare) {
        var new_yCoord = roundingOff(Math.sqrt(centerLimitSquare - xCoordSquare) + 0.004);
        if (yCoordLast < 0) {
            new_yCoord *= -1;
        }
        $("#yCoord").val(new_yCoord);
    }
}

/* Processing of buttons */
function buttonsHandler(rotationOfFirstBeam, rotationOfSecondBeam, canvasParams) {
    // Global variable of last position of angles in this function
    var lastPositionsOfAngles = [Number($("#angleA").val()), Number($("#angleB").val())];

    // Processing of button default
    $("#defaultButton").click(function () {
        $("#dirLengthA").val(5);
        $("#dirLengthB").val(5);
        $("#angleA").val(0);
        $("#angleB").val(0);
        $("#invLengthA").val(5);
        $("#invLengthB").val(5);
        $("#xCoord").val(0);
        $("#yCoord").val(-10);

        // Load standard size of beams
        var lastCanvasWidth = canvasParams[7];
        var lastCanvasHeight = canvasParams[8];
        var radius = canvasParams[5];
        var beamWidth = 10;
        if (lastCanvasWidth == canvasParams[0].width || 
            lastCanvasHeight == canvasParams[0].height) {
                beamsSettingCSS(radius, beamWidth, Number($("#dirLengthA").val()),
                Number($("#dirLengthB").val()));
        }

        // [angleA, angleB]
        var angles = [Number($("#angleA").val()), Number($("#angleB").val())];
        // [xCoord, yCoord]
        var coords = [Number($("#xCoord").val()), Number($("#yCoord").val())];

        // Moving the beams to the standard position
        rotatingBeams(rotationOfFirstBeam, rotationOfSecondBeam, canvasParams,
            angles, coords, 0, lastPositionsOfAngles);

        // Setting new positions of angles
        lastPositionsOfAngles = [0, 0];

        // Pressing to the toggle button
        /*var dataToggle = $("#toggleButton").attr("data-toggle");
        if (dataToggle) {
            $('#toggleButton').click();
        }
        $("#toggleButton").attr("data-toggle", false);*/
    });
    // Processing of button of form dirProb
    $("#dirProbButton").click(function () {
        // [angleA, angleB]
        var angles = [Number($("#angleA").val()), Number($("#angleB").val())];

        // Finding xCoord and yCoord [xCoord, yCoord]
        var coords = angleToCoords(angles);

        // rounding off 
        coords[0] = roundingOff(coords[0]);
        coords[1] = roundingOff(coords[1]);

        // Setting new params of coordinates
        $("#xCoord").val(coords[0]);
        $("#yCoord").val(coords[1]);

        // Rotating of beams
        rotatingBeams(rotationOfFirstBeam, rotationOfSecondBeam, canvasParams,
            angles, coords, 5000, lastPositionsOfAngles);

        // Setting new positions of angles
        lastPositionsOfAngles = angles;
    });
    // Processing of button of form invProb
    $("#invProbButton").click(function () {
        // [xCoord, yCoord]
        var coords = [Number($("#xCoord").val()), Number($("#yCoord").val())];

        // Zero verification
        if (coords[0] == 0 && coords[1] == 0) {
            var angles = [0, 180];
        } else {
            // Find angleA and angleB [angleA, angleB]
            var angles = coordsToAngle(coords);
        }

        // rounding off 
        angles[0] = roundingOff(angles[0]);
        angles[1] = roundingOff(angles[1]);

        // Setting new params of angles
        $("#angleA").val(angles[0]);
        $("#angleB").val(angles[1]);

        // Rotating of beams
        rotatingBeams(rotationOfFirstBeam, rotationOfSecondBeam, canvasParams,
            angles, coords, 5000, lastPositionsOfAngles);

        // Setting new positions of angles
        lastPositionsOfAngles = angles;
    });
    // Processing of dropdown menu
    $(".dropdown-toggle").click(function () {
        $(".dropdown-toggle").css({"background-image": "none",
        "background-repeat": "no-repeat"});
    });
}

/* Function for finding x and y coords */
function angleToCoords(angles) {
    var lengthA = Number($("#dirLengthA").val());
    var lengthB = Number($("#dirLengthB").val());
    var angleA_rad = Math.PI / 180 * angles[0];
    var angleB_rad = Math.PI / 180 * angles[1];

    // Calculation of xCoord and yCoord
    var xCoord = lengthA * Math.sin(angleA_rad) +
        lengthB * Math.sin(angleA_rad + angleB_rad);
    var yCoord = -(lengthA * Math.cos(angleA_rad) +
        lengthB * Math.cos(angleA_rad + angleB_rad));

    // [xCoord, yCoord]
    var coords = [xCoord, yCoord];

    return coords;
}

/* Function for finding angleA and angleB angles */
function coordsToAngle(coords) {
    var lengthA = Number($("#invLengthA").val());
    var lengthB = Number($("#invLengthB").val());
    var distanceToCenter = Math.sqrt(Math.pow(coords[0], 2) + Math.pow(coords[1], 2));

    var angleA = (Math.acos(coords[0] / distanceToCenter) -
        Math.acos(
            (Math.pow(lengthA, 2) -
                Math.pow(lengthB, 2) +
                Math.pow(distanceToCenter, 2)) /
            (2 * lengthA * distanceToCenter))) * 180 / Math.PI;

    var angleB = (Math.PI - Math.acos(
        (Math.pow(lengthA, 2) + Math.pow(lengthB, 2) - Math.pow(distanceToCenter, 2)) / 
            (2 * lengthA * lengthB))) * 180 / Math.PI;

    // [angleA, angleB]
    var angles = [angleA, angleB];

    // yCoord < 0
    if (coords[1] < 0) {
        angles[0] *= -1;
        angles[1] *= -1;
    }

    // Adjustment of the starting position
    angles[0] += 90;

    return angles;
}

// Rounding some number
function roundingOff(number) {
    return Math.round(number * 100) / 100;
}

/* Function for ratating of beams */
function rotatingBeams(rotationOfFirstBeam, rotationOfSecondBeam, canvasParams,
    angles, coords, duration = 5000, lastPositionsOfAngles = [0, 0], startPosition = -90) {
    // The last position of the canvas
    var lastCanvasWidth = canvasParams[7];
    var lastCanvasHeight = canvasParams[8];

    // Direction of movement angleA
    var newAngleA = directionOfMovement(angles[0], lastPositionsOfAngles[0]);
    // Direction of movement angleB
    var newAngleB = directionOfMovement(angles[1], lastPositionsOfAngles[1]);

    // Movement with anime.js
    rotationOfFirstBeam = anime({
        targets: ['.animeLoader-1'],
        rotate: -newAngleA + startPosition,
        duration: duration,
        easing: 'easeInOutQuad',
    });
    rotationOfSecondBeam = anime({
        targets: ['.animeLoader-2'],
        rotate: -newAngleB,
        duration: duration,
        easing: 'easeInOutQuad',
        begin: function(anim) {
            if (lastCanvasWidth == canvasParams[0].width || 
                lastCanvasHeight == canvasParams[0].height) {
                    drawCanvas(canvasParams);
            }
            // Block items
            if (duration != 0) {
                blockUnblock(true);
            }
        },
        complete: function(anim) {
            if (lastCanvasWidth == canvasParams[0].width || 
                lastCanvasHeight == canvasParams[0].height) {
                    updateCanvas(canvasParams, angles, coords);
            }
            // Unblock items
            if (duration != 0) {
                blockUnblock(false);
            }
        },
    });
}

/* Function for correcting the direction of movement */
function directionOfMovement(angle, lastPosition) {
    // Direction of movement any angle
    var positionWithDeviation = 180 + lastPosition;
    if (positionWithDeviation > 360) {
        positionWithDeviation -= 360;
    }
    if (angle > positionWithDeviation) {
        var newAngle = angle - 360;
    } else {
        var newAngle = angle;
    }
    return newAngle;
}

/* Function for updating canvas */
function updateCanvas(canvasParams, angles, coords) {
    var canvas = canvasParams[0];
    var context = canvasParams[1];
    var centerOfWidth = canvasParams[2];
    var centerOfHeight = canvasParams[3];
    var navbarHeight = canvasParams[4];
    var radius = canvasParams[5];
    var systemIndent = canvasParams[6];
    var indent = radius / 10;

    // Text parameters
    var size = radius / 13;
    var degreeSize = radius / 26;
    // [degreeAIndent, degreeBIndent]
    var indentOfDegree = indentForDegree(angles);
    var textOfDegree = "o";
    context.fillStyle = "red";
    context.textBaseline = "middle";
    context.textAlign = "center";

    // Calculating coords of angleA text, [xPosAngleA, yPosAngleA]
    var angleAPosition = textPosAngleA(angles, centerOfWidth, centerOfHeight, indent);

    // Calculating coords of angleB text, [xPosAngleB, yPosAngleB]
    var angleBPosition = textPosAngleB(angles, centerOfWidth, centerOfHeight, indent, radius);

    // Calculating coords of coords text, [xPosCoords, yPosCoords]
    var coordsPosition = textPosCoords(angles, coords, centerOfWidth, centerOfHeight, 
        indent, radius);

    // Write angleA
    var textOfAngleA = angles[0];
    context.font = size + "px Arimo";
    context.fillText(textOfAngleA, angleAPosition[0], angleAPosition[1]);
    context.font = degreeSize + "px Arimo";
    context.fillText(textOfDegree, angleAPosition[0] + indentOfDegree[0] * degreeSize, 
        angleAPosition[1] - degreeSize);

    // Write angleB
    context.font = size + "px Arimo";
    var textOfAngleB = angles[1];
    context.fillText(textOfAngleB, angleBPosition[0], angleBPosition[1]);
    context.font = degreeSize + "px Arimo";
    context.fillText(textOfDegree, angleBPosition[0] + indentOfDegree[1] * degreeSize, 
        angleBPosition[1] - degreeSize);

    // Write coords
    context.font = size + "px Arimo";
    var textOfCoords = "[" + coords[0] + ", " + coords[1] + "]";
    context.fillText(textOfCoords, coordsPosition[0], coordsPosition[1]);
}

/* Blocking or unblocking these items */
function blockUnblock(bool) {
    $("#defaultButton").prop("disabled", bool);
    $("#dirLengthA").prop("disabled", bool);
    $("#dirLengthB").prop("disabled", bool);
    $("#angleA").prop("disabled", bool);
    $("#angleB").prop("disabled", bool);
    $("#dirProbButton").prop("disabled", bool);
    $("#invLengthA").prop("disabled", bool);
    $("#invLengthB").prop("disabled", bool);
    $("#xCoord").prop("disabled", bool);
    $("#yCoord").prop("disabled", bool);
    $("#invProbButton").prop("disabled", bool);
}

/* Calculating coords of angleA text */
function textPosAngleA(angles, centerOfWidth, centerOfHeight, indent) {
    if (angles[0] >= 0 && angles[0] < 90) {
        var xPosAngleA = centerOfWidth - indent;
        var yPosAngleA = centerOfHeight - indent;
    }
    else if (angles[0] >= 90 && angles[0] < 180) {
        var xPosAngleA = centerOfWidth - indent;
        var yPosAngleA = centerOfHeight + indent;
    }
    else if (angles[0] >= 180 && angles[0] < 270) {
        var xPosAngleA = centerOfWidth + indent;
        var yPosAngleA = centerOfHeight + indent;
    }
    else {
        var xPosAngleA = centerOfWidth + indent;
        var yPosAngleA = centerOfHeight - indent;
    }

    return [xPosAngleA, yPosAngleA];
}

/* Calculating coords of angleB text */
function textPosAngleB(angles, centerOfWidth, centerOfHeight, indent, radius) {
    var lengthA = Number($("#dirLengthA").val());
    var lengthB = Number($("#dirLengthB").val());
    var pxLengthA = lengthA / (lengthA + lengthB) * radius;
    var xIndent = pxLengthA * Math.sin(Math.PI / 180 * angles[0]);
    var yIndent = -(pxLengthA * Math.cos(Math.PI / 180 * angles[0]));

    if (angles[0] >= 0 && angles[0] < 90) {
        if (angles[1] >= 0 && angles[1] < 90) {
            var xPosAngleB = centerOfWidth + xIndent - indent;
            var yPosAngleB = centerOfHeight - yIndent + indent;
        }
        else if (angles[1] >= 90 && angles[1] < 180) {
            var xPosAngleB = centerOfWidth + xIndent - indent;
            var yPosAngleB = centerOfHeight - yIndent + indent;
        }
        else if (angles[1] >= 180 && angles[1] < 270) {
            var xPosAngleB = centerOfWidth + xIndent + indent;
            var yPosAngleB = centerOfHeight - yIndent - indent;
        }
        else {
            var xPosAngleB = centerOfWidth + xIndent + indent;
            var yPosAngleB = centerOfHeight - yIndent - indent;
        }
    }
    else if (angles[0] >= 90 && angles[0] < 180) {
        if (angles[1] >= 0 && angles[1] < 90) {
            var xPosAngleB = centerOfWidth + xIndent + indent;
            var yPosAngleB = centerOfHeight - yIndent + indent;
        }
        else if (angles[1] >= 90 && angles[1] < 180) {
            var xPosAngleB = centerOfWidth + xIndent + indent;
            var yPosAngleB = centerOfHeight - yIndent - indent;
        }
        else if (angles[1] >= 180 && angles[1] < 270) {
            var xPosAngleB = centerOfWidth + xIndent - indent;
            var yPosAngleB = centerOfHeight - yIndent - indent;
        }
        else {
            var xPosAngleB = centerOfWidth + xIndent - indent;
            var yPosAngleB = centerOfHeight - yIndent - indent;
        }
    }
    else if (angles[0] >= 180 && angles[0] < 270) {
        if (angles[1] >= 0 && angles[1] < 90) {
            var xPosAngleB = centerOfWidth + xIndent + indent;
            var yPosAngleB = centerOfHeight - yIndent - indent;
        }
        else if (angles[1] >= 90 && angles[1] < 180) {
            var xPosAngleB = centerOfWidth + xIndent - indent;
            var yPosAngleB = centerOfHeight - yIndent - indent;
        }
        else if (angles[1] >= 180 && angles[1] < 270) {
            var xPosAngleB = centerOfWidth + xIndent - indent;
            var yPosAngleB = centerOfHeight - yIndent - indent;
        }
        else {
            var xPosAngleB = centerOfWidth + xIndent - indent;
            var yPosAngleB = centerOfHeight - yIndent + indent;
        }
    }
    else {
        if (angles[1] >= 0 && angles[1] < 90) {
            var xPosAngleB = centerOfWidth + xIndent - indent;
            var yPosAngleB = centerOfHeight - yIndent - indent;
        }
        else if (angles[1] >= 90 && angles[1] < 180) {
            var xPosAngleB = centerOfWidth + xIndent - indent;
            var yPosAngleB = centerOfHeight - yIndent + indent;
        }
        else if (angles[1] >= 180 && angles[1] < 270) {
            var xPosAngleB = centerOfWidth + xIndent - indent;
            var yPosAngleB = centerOfHeight - yIndent + indent;
        }
        else {
            var xPosAngleB = centerOfWidth + xIndent + indent;
            var yPosAngleB = centerOfHeight - yIndent + indent;
        }
    }

    return [xPosAngleB, yPosAngleB];
}

/* Calculating coords of coords text */
function textPosCoords(angles, coords, centerOfWidth, centerOfHeight, indent, radius) {
    if (angles[0] >= 0 && angles[0] < 45) {
        if (angles[1] >= 0 && angles[1] < 90) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 2 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
        else if (angles[1] >= 90 && angles[1] < 180) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 2 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
        else if (angles[1] >= 180 && angles[1] < 270) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 2.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
        else {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 2 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
    }
    else if (angles[0] >= 45 && angles[0] < 90) {
        if (angles[1] >= 0 && angles[1] < 90) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
        else if (angles[1] >= 90 && angles[1] < 180) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
        else if (angles[1] >= 180 && angles[1] < 270) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
        else {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
    }
    else if (angles[0] >= 90 && angles[0] < 135) {
        if (angles[1] >= 0 && angles[1] < 90) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
        else if (angles[1] >= 90 && angles[1] < 180) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
        else if (angles[1] >= 180 && angles[1] < 270) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
        else {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
    }
    else if (angles[0] >= 135 && angles[0] < 180) {
        if (angles[1] >= 0 && angles[1] < 90) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 2.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10;
        }
        else if (angles[1] >= 90 && angles[1] < 180) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 2 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
        else if (angles[1] >= 180 && angles[1] < 270) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 2 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
        else {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 2 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
    }
    else if (angles[0] >= 180 && angles[0] < 225) {
        if (angles[1] >= 0 && angles[1] < 90) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 2 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
        else if (angles[1] >= 90 && angles[1] < 180) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 2 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
        else if (angles[1] >= 180 && angles[1] < 270) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
        else {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 2.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
    }
    else if (angles[0] >= 225 && angles[0] < 270) {
        if (angles[1] >= 0 && angles[1] < 90) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
        else if (angles[1] >= 90 && angles[1] < 180) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
        else if (angles[1] >= 180 && angles[1] < 270) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
        else {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 2 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
    }
    else if (angles[0] >= 270 && angles[0] < 315) {
        if (angles[1] >= 0 && angles[1] < 90) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
        else if (angles[1] >= 90 && angles[1] < 180) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
        else if (angles[1] >= 180 && angles[1] < 270) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
        else {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 2 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
    }
    else {
        if (angles[1] >= 0 && angles[1] < 90) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 2.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - 0.5 * indent;
        }
        else if (angles[1] >= 90 && angles[1] < 180) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 + 1.5 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 + indent;
        }
        else if (angles[1] >= 180 && angles[1] < 270) {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 2 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
        else {
            var xPosCoords = centerOfWidth + radius * coords[0] / 10 - 2 * indent;
            var yPosCoords = centerOfHeight - radius * coords[1] / 10 - indent;
        }
    }

    return [xPosCoords, yPosCoords];
}

/* Function for finding indent for degree */
function indentForDegree(angles) {
    if ((angles[0] % 1) != 0) {
        var degreeAIndent = 3.2;
    }   else {
        var degreeAIndent = 1.5;
    }
    if ((angles[1] % 1) != 0) {
        var degreeBIndent = 3.2;
    }   else {
        var degreeBIndent = 1.5;
    }

    return[degreeAIndent, degreeBIndent];
}