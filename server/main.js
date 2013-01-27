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
            score: [
            {
                'element': 'bisturi',
                'target': 10,
                'score': 0,
                'status': 'ativo'
            }
            ]
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
}
})