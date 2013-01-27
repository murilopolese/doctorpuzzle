Meteor.startup(function() {
    
    })

Meteor.methods({
    createRoom: function(userid) {
        gameId = parseInt(Math.random() * 100000);
        games.insert({
            gameId: gameId,
            ownerId: userid,
            players: [{
                userId: userid
            }],
            status: 'waiting players',
            score: 0,
            target: 5,
            cureElement: 'sangue'
        });
        return gameId;
    },
    startGame: function(gameId, userId) {
        n = games.findOne({
            ownerId: userId
        },
        {
            gameId: gameId
        });
        console.log(n.players.length)
        
        
        games.update({
            ownerId: userId, 
            gameId: gameId
        }, {
            $set: {
                status: 'ativo',
                target: 5 * n.players.length
            }
        })
    },
    joinGame: function(gameId, userId) {
        games.update({
            gameId: parseInt(gameId)
        }, {
            $push: {
                players: {
                    userId: userId
                }
            }
        });
    },
    addScore: function(gameId, element, score) {
        var myGame = games.findOne({
            gameId: parseInt(gameId)
        });
        if(element == myGame.cureElement) {
            console.log('marcou ponto');
            games.update(
            {
                gameId: parseInt(gameId)
            },
            {
                $inc: {
                    score: 1
                }
            })
            if(Math.random() > 0.8) {
                e = randomize();
                games.update(
                {
                    gameId: parseInt(gameId)
                },
                {
                    $set: {
                        cureElement: e
                    }
                })
                console.log('Agora é ' + e);
            }
        }
    },
    getResult: function(gameId) {
        var result = games.findOne({
            gameId: gameId
        });
        return result;
    }
})