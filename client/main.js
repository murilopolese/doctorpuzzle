var board = new Array();
var elements = [{
    element_id: 'red'
}, 
{
    element_id: 'green'
}, 
{
    element_id: 'blue'
}];
var selectedPiece;

Meteor.startup(function() {
    console.log('iniciou appplicação');
    populateBoard(4, 4);
    drawBoard();
});

function populateBoard(width, height) {
    for(i = 0; i < width; i++) {
        board[i] = [];
        for(j = 0; j < height; j++) {
            board[i][j] = 
            elements[parseInt(Math.random()*elements.length)].element_id
        }
    }
}

function drawBoard() {
    $('#board').html('');
    for(i = 0; i < board.length; i++) {
        for(j = 0; j < board[i].length; j++) {
            $('#board').append('<div id="' + i + 'x' + j + '" class="piece ' + board[i][j] + '"></div>');
        }
    }
    bindClick();
}

function isNear() {
    if((clickedCoord[0] == selectedCoord[0]) &&
        (Math.abs(clickedCoord[1] - selectedCoord[1]) == 1)) {
        return true;
    }
    if((clickedCoord[1] == selectedCoord[1]) &&
        (Math.abs(clickedCoord[0] - selectedCoord[0]) == 1)) {
        return true;
    }
    
    return false;
}

function bindClick() {
    $('.piece').click(function() { // PRIMEIRO CLIQUE
        if(selectedPiece == undefined) {
            selectedPiece = $(this).attr('id');
            $(this).addClass('selected');
        } else { // SEGUNDO CLIQUE
            selectedCoord = selectedPiece.split('x');
            clickedCoord = $(this).attr('id').split('x');
            if(isNear()) {
                exchangePieces();
                drawBoard();
                selectedPiece = undefined;
            } else {
                $('.selected').removeClass('selected');
                selectedPiece = undefined;
            }
            selectedCoord = null;
            clickedCoord = null;
        }
    });
}

function exchangePieces() {
    var temp;
    temp = board[selectedCoord[0]][selectedCoord[1]];
    board[selectedCoord[0]][selectedCoord[1]] = board[clickedCoord[0]][clickedCoord[1]];
    board[clickedCoord[0]][clickedCoord[1]] = temp;
}

function match() {
    matches = [];
    for(var line = 0; line < board.length; line++) {
        matchLine(line);
    }
    for(var col = 0; col < board[0].length; col++) {
        matchCol(col);
    }
    console.log(matches);
}

function matchLine(line) {
    var hitCount = 0;
    var firstMatch;
    var pointer = board[line][0];
    for(i = 1; i < board[line].length; i++) {
        if(pointer == board[line][i]) {
            hitCount++;
            if (hitCount == 1) {
                firstMatch = [line, i-1];
            }
            if (i==(board[line].length-1) && hitCount > 1) {
                matches.push([firstMatch, [line, i]]);
                hitCount = 0;
            }
        } else {
            if (hitCount > 1) {
                matches.push([firstMatch, [line, i-1]]);
            }
            hitCount = 0;
        }
        pointer = board[line][i];
    }
}

function matchCol(col) {
    var hitCount = 0;
    var firstMatch;
    var pointer = board[0][col];
    for(i = 1; i < board[col].length; i++) {
        if(pointer == board[i][col]) {
            hitCount++;
            if (hitCount == 1) {
                firstMatch = [i-1, col];
            }
            if (i==(board[col].length-1) && hitCount > 1) {
                matches.push([firstMatch, [i-1, col]]);
                hitCount = 0;
            }
        } else {
            if (hitCount > 1) {
                matches.push([firstMatch, [i-1, col]]);
            }
            hitCount = 0;
        }
        pointer = board[i][col];
    }
}