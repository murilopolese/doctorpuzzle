Meteor.startup(function() {
    
    })

Meteor.methods({
    createRoom: function(userid) {
        console.log('create Room');
        gameId = parseInt(Math.random() * 100000);
        games.insert({
            gameId: gameId,
            ownerId: userid,
            players: [{
                userId: userid
            }],
            status: 'waiting players',
            score: 0,
            cureElement: 'sangue'
        });
        return gameId;
    },
    startGame: function(gameId, userId) {
        games.update({
            ownerId: userId, 
            gameId: gameId
        }, {
            $set: {
                status: 'ativo'
            }
        })
    },
    joinGame: function(gameId, userId) {
        console.log(userId + ' joined game ' + gameId)
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
        console.log(myGame.cureElement);
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
                games.update(
                {
                    gameId: parseInt(gameId)
                },
                {
                    $set: {
                        cureElement: randomize()
                    }
                })
            }
        }
    }
})