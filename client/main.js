var board = new Array();
var elements = [
{
    element_id: 'red'
}, 
{
    element_id: 'green'
}, 
{
    element_id: 'blue'
} 
];
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

function isNear(id) {
    var selectedCoord = selectedPiece.split('x');
    var clickedCoord = id.split('x');
    
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
    $('.piece').click(function() {
        if(selectedPiece == undefined) {
            selectedPiece = $(this).attr('id');
            $(this).addClass('selected');
        } else {
            if(isNear($(this).attr('id'))) {
                console.log('is near')
                drawBoard();
                selectedPiece = undefined;
            } else {
                $('.selected').removeClass('selected');
                selectedPiece = undefined;
            }
        }
    });
}