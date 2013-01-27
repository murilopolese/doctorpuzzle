Meteor.startup(function() {
    
    })

Meteor.methods({
    createRoom: function(userId) {
        e = 'sangue';
        gameId = parseInt(Math.random() * 100000);
        games.insert({
            gameId: gameId,
            ownerId: userId,
            players: [{
                userId: userId
            }],
            status: 'waiting players',
            score: 0,
            target: 5,
            notification: {
                userId: userId,
                cureElement: e
            }
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
        if(element == myGame.notification.cureElement) {
//            console.log('marcou ponto');
            games.update(
            {
                gameId: parseInt(gameId)
            },
            {
                $inc: {
                    score: 1
                }
            })
            if(Math.random() > 0.2) {
                e = randomize();
//                console.log('agora é '+e);
                games.update(
                {
                    gameId: parseInt(gameId)
                },
                {
                    $set: {
                        notification: {
                            userId: 8792195660062134000,
                            cureElement: e
                        }
                    }
                })
                
            }
            return true;
        }
        return false;
    },
    getResult: function(gameId) {
        var result = games.findOne({
            gameId: gameId
        });
        return result;
    }
})