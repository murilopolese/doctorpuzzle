var board = new Array();
var selectedPiece;

Meteor.startup(function() {
    if($.cookie('userId') == null) {
        $.cookie('userId', parseInt(Math.random() * 100000));
    }
    if(document.URL.search('game/') != -1) {
        game = document.URL.split('game/');
        Session.set('gameId', game[1]);
        Meteor.call('joinGame', Session.get('gameId'), $.cookie('userId'));
        $('#board').html('aguarde o jogo '+Session.get('gameId')+' começar');
    }
});

Template.game.start = function() {
    myGame = games.findOne({
        gameId: parseInt(Session.get('gameId'))
    });
    if(myGame != undefined) {
        if((myGame.status == 'ativo') && (myGame.score == 0)) {
            startGame();
        }
    } else {
        return '';
    }
}

Template.game.notification = function() {
    myGame = games.findOne({
        gameId: parseInt(Session.get('gameId'))
    });
    if((myGame != undefined) && (myGame.notification.userId == parseInt($.cookie('userId')))) {
        return (myGame.notification.cureElement)
    } else {
        return 'default';
    }
}

function createRoom() {
    Meteor.call('createRoom', $.cookie('userId'), function(error, result) {
        $('#board').html('')
        Session.set('gameId', result);
        $('#board').append('<div id="qrcode"></div>');
        $('#qrcode').qrcode({
            width: 300,
            height: 300,
            color: '#000',
            bgColor: '#FFF',
            text: 'http://bjdoctor.meteor.com/game/'+Session.get('gameId')
        });
        $('#qrcode').append('<p class="host"><a class="start" href="javascript:callStart()">START GAME</a></p>');
    });
}

function callStart() {
    Meteor.call('startGame', Session.get('gameId'), $.cookie('userId'), function() {
        
        })
}

function startGame() {
    populateBoard(4, 4);
    drawBoard();
    bindClick();
    var interval = setTimeout(function() {
        gameOver();
    }, 60*1000);
}

function gameOver() {
    Meteor.call('getResult', Session.get('gameId'), function(error, result) {
        if(result.score >= result.target) {
            $('#board').html('<img class="finish" src="/imgs/win.jpg" />');
        } else {
            $('#board').html('<img class="finish" src="/imgs/gameover.jpg" />');
        }
        //        $('#board').append('<br />Seu time fez: '+result.score);
        //        $('#board').append('<br />Era pra fazer: '+result.target);
        Meteor.call('finishGame', Session.get('gameId'), $.cookie('userId'));
        
    });
}

function populateBoard(width, height) {
    for(i = 0; i < width; i++) {
        board[i] = [];
        for(j = 0; j < height; j++) {
            board[i][j] = randomize();
        }
    }
    match();
}

function drawBoard() {
    $('#board').html('');
    for(i = 0; i < board.length; i++) {
        for(j = 0; j < board[i].length; j++) {
            $('#board').append('<img src="/imgs/'+board[i][j]+'.png" id="' + i + 'x' + j + '" class="piece ' + board[i][j] + '"></div>');
        }
    }
//    bindClick();
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
                match();
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
    drawBoard();
}

function match() {
    $('.piece').unbind();
    matches = [];
    getMatches();
    if(matches.length > 0) {
        setTimeout(function() {
            replacePieces(matches);
            match();
        }, 500);
    } else {
        bindClick();
    }
}

function getMatches() {
    for(var line = 0; line < board.length; line++) {
        matchLine(line);
    }
    for(var col = 0; col < board[0].length; col++) {
        matchCol(col);
    }
}


function matchLine(line) {
    var hitCount = 0;
    var firstMatch;
    var pointer = board[line][0];
    for(i = 1; i < board[line].length; i++) {
        if(pointer == board[line][i]) {
            hitCount++;
            if (hitCount == 1) {
                firstMatch = {
                    'y': line, 
                    'x': i-1
                };
            }
            if (i==(board[line].length-1) && hitCount > 1) {
                matches.push({
                    'firstMatch': firstMatch, 
                    'lastMatch': {
                        'y': line, 
                        'x': i
                    }
                });
                hitCount = 0;
            }
        } else {
            if (hitCount > 1) {
                matches.push({
                    'firstMatch': firstMatch, 
                    'lastMatch': {
                        'y': line, 
                        'x': i-1
                    }
                });
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
                firstMatch = {
                    'y': i-1, 
                    'x': col
                };
            }
            if (i==(board[col].length-1) && hitCount > 1) {
                matches.push({
                    'firstMatch': firstMatch, 
                    'lastMatch': {
                        'y': i, 
                        'x': col
                    }
                });
                hitCount = 0;
            }
        } else {
            if (hitCount > 1) {
                matches.push({
                    'firstMatch': firstMatch, 
                    'lastMatch': {
                        'y': i-1, 
                        'x':col
                    }
                });
            }
            hitCount = 0;
        }
        pointer = board[i][col];
    }
}

function replacePieces(m) {
    for(var i = 0; i < m.length; i++) {
        Meteor.call(
            'addScore', 
            Session.get('gameId'), 
            board[m[0].firstMatch.y][m[0].firstMatch.x], 
            1,
            function(error, result) {
                if(result) {
                    $('#scored').fadeIn(500, function() {
                        $(this).fadeOut(500);
                    })
                }
            });
        if(m[i].firstMatch.x == m[i].lastMatch.x) { // COLUNA
            for(var j = m[i].firstMatch.y; j <= m[i].lastMatch.y; j++) {
                board[j][m[i].firstMatch.x] = randomize();
            }
        } else { // LINHA
            for(var j = m[i].firstMatch.x; j <= m[i].lastMatch.x; j++) {
                board[m[i].firstMatch.y][j] = randomize();
            }
        }
    }
    drawBoard();
}
