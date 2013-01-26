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
    }, 
];

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
    for(i = 0; i < board.length; i++) {
        for(j = 0; j < board[i].length; j++) {
            $('#board').append('<div class="piece ' + board[i][j] + '"></div>');
        }
    }
}