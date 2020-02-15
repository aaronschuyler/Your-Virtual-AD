// Fetch all Players
app.get('/players', (req, res) => {
    Player.find({}, 'playerName', function (error, posts) {
        if (error) {
            console.error(error)
        }
        res.send({
            players: players
        })
    }).sort().exec(function (err, docs) {})
})
// Add Player
app.post('/players', (req, res) => {
    var db = req.db
    var playerName = req.body.playerName
    var new_player = new Player({
        playerName: playerName
    })

    new_player.save(function (error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true,
            message: 'Player saved successfully!'
        })
    })
})
// Fetch single Player
app.get('/players/:playerName', (req, res) => {
    var db = req.db
    Player.find({playerName: req.params.playerName}, 'playerName', function (error, post) {
        if (error) {
            console.error(error)
        }
        res.send(post)
        console.log("fetching player")
    })
})
// Update a Player
app.put('/players/:playerName', (req, res) => {
    var db = req.db
    Player.findOne({playerName: req.params.playerName}, 'playerName', function (error, post) {
        if (error) {
            console.error(error)
        }

        post.playerName = req.body.playerName
        post.save(function (error) {
            if (error) {
                console.log(error)
            }
            res.send({
                success: true
            })
        })
    })
})
// Delete a Player
app.delete('/players/:playerName', (req, res) => {
    var db = req.db
    Player.remove({
        playerName: req.params.playerName
    }, function (err, post) {
        if (err)
            res.send(err)
        res.send({
            success: true
        })
    })
})