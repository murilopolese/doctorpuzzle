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
            target: 10,
            cureElement: 'sangue'
        });
        return gameId;
    },
    startGame: function(gameId, userId) {
        n = games.find({
            ownerId: userId
        },
        {
            gameId: gameId
        }).fetch().length;
        
        games.update({
            ownerId: userId, 
            gameId: gameId
        }, {
            $set: {
                status: 'ativo',
                target: 10 * n
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