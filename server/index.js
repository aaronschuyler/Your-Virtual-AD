const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const morgan = require('morgan')
const multer = require('multer')
const fs = require('fs')
//cors
const cors = require('cors')
const corsOptions = {
    origin: ['http://admin.yourvirtualad.com', 'http://yourteampage.com', 'http://localhost:8080', 'http://localhost:8081'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], //the port my vue app is running on.
    credentials: true,
}

//passport
const passport = require('passport')
const LocalStrategy = require('passport-local')

//mongodb
const mongoose = require('mongoose', {
    useUnifiedTopology: true
})
//models for mongo
const Post = require("./models/post")
const Team = require("./models/teams")
const User = require("./models/user")
const Org = require("./models/org")
const Site = require("./models/site")
const Div = require("./models/div")
const Player = require("./models/players")
const Sport = require("./models/sport")

const session = require("express-session")

//create app
const app = express()
app.set('trust proxy', true)

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors(corsOptions))
app.use(express.static("public"))
app.use(session({
    secret: "cats",
    cookie: {
        secure: false
    },
    store: new(require("express-sessions"))({
        storage: 'mongodb',
        storage: 'mongodb',
        instance: mongoose, // optional
        host: 'localhost', // optional
        port: 27017, // optional
        db: 'test', // optional
        collection: 'sessions', // optional
        expire: 86400 // optional
    })
}))
app.use(cookieParser('cats'))
app.use(passport.initialize())
app.use(passport.session())
//mongodb connection
mongoose.connect('mongodb+srv://yvad-admin:%40Green55Grocer@cluster0-91zno.mongodb.net/posts', {
    useNewUrlParser: true
})
var db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", function (callback) {
    console.log("Connection Succeeded")
})
//app active
app.listen(8000, () => {
    console.log('Example app listening on port 8000!')
})
//file upload handling
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("")
        var dir = "./public/images/" + req.body.team
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        var ending = file.originalname.substr(file.originalname.length - 4)
        cb(null, "hero" + ending)
    }
})
const upload = multer({
    dest: './public/images',
    storage: storage
})
app.post('/images', upload.single('file'), (req, res) => {
    console.log(req.body.team)
    res.json({
        file: req.file,
        team: req.body.team
    })
})
//passport stuff
///passport serializaition
passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    //If using Mongoose with MongoDB if other you will need JS specific to that schema.
    User.findById(user._id, function (err, user) {
        done(err, user)
    })
})
/////validation of user
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false)
            }
            if (user.password != password) {
                return done(null, false)
            }
            return done(null, user)
        })
    }
))

/////API Routes
//USER ROUTES
//login
app.post('/users',
    passport.authenticate('local'),
    function (req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        req.session.save(function (err) {
            console.log('saved?!')
        })
        res.send(req.session)
    })
app.get('/users', (req, res) => {
    User.find({}, function (error, posts) {
        if (error) {
            console.error(error)
        }
        res.send({
            users: posts
        })
    })
})
//registeration
app.post('/signup', (req, res) => {
    var db = req.db
    var username = req.body.username
    var password = req.body.password
    var accessLevel = req.body.accessLevel
    var organization = req.body.organization
    var new_user = new User({
        username: username,
        password: password,
        accessLevel: accessLevel,
        organization: organization

    })

    new_user.save(function (error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true,
            message: 'User saved successfully!'
        })
    })
})
//testing session
app.get('/users', (req, res) => {
    if (req.user) {
        res.send(req.user)
        console.log("you got this!")
    } else {
        res.send("you do not have access to this page!")
    }
})
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        // cannot access session here
    })
    console.log("logging out!")
});

///GAME ROUTES
// Fetch all games
app.get('/posts', (req, res) => {
    Post.find({}, 'team1 team2 date gameSite display', function (error, posts) {
        if (error) {
            console.error(error)
        }
        res.send({
            posts: posts
        })
    }).sort('date').exec(function (err, docs) {})
})
// Fetch games by team name
app.get('/posts/:teamName', (req, res) => {
    var db = req.db
    Post.find({
        $or: [{
            team1: req.params.teamName
        }, {
            team2: req.params.teamName
        }]
    }, 'team1 team2 date gameSite display', function (error, posts) {

        if (error) {
            console.error(error)
        }
        res.send({
            posts: posts
        })
    }).sort('date').exec(function (err, docs) {})
})
// Add Game
app.post('/posts', (req, res) => {
    var db = req.db
    var team1 = req.body.team1
    var team2 = req.body.team2
    var date = req.body.date
    var gameSite = req.body.gameSite

    var new_post = new Post({
        team1: team1,
        team2: team2,
        date: date,
        gameSite: gameSite

    })

    new_post.save(function (error) {
        if (error) {
            console.log(error)

        }
        res.send({
            success: true,
            message: 'Post saved successfully!'
        })
    })
})
// Fetch single Game
app.get('/post/:id', (req, res) => {
    var db = req.db
    Post.findById(req.params.id, 'team1 team2 date', function (error, post) {
        if (error) {
            console.error(error)
        }
        res.send(post)
        console.log("fetching")
    })
})
// Update a Game
app.put('/posts/:id', (req, res) => {
    var db = req.db
    Post.findById(req.params.id, 'team1 team2 date', function (error, post) {
        if (error) {
            console.error(error)
        }

        post.team1 = req.body.team1
        post.team2 = req.body.team2
        post.date = req.body.date
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
// Delete a Game
app.delete('/posts/:id', (req, res) => {
    var db = req.db
    Post.remove({
        _id: req.params.id
    }, function (err, post) {
        if (err)
            res.send(err)
        console.log(err)
        res.send({
            success: true
        })
        console.log("!!!!Here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    })
})

//TEAMS Routes
//Fetch Teams 
app.get('/teams', (req, res) => {
    Team.find({}, 'teamName organization sport division display published', function (error, teams) {
        if (error) {
            console.error(error)
        }
        res.send({
            teams: teams
        })

    })
})
// Fetch single Team
app.get('/teams/:teamName', (req, res) => {
    var db = req.db
    Team.find({
        'teamName': req.params.teamName
    }, 'teamName teamPage published', function (error, post) {
        if (error) {
            console.error(error)
        }
        res.send(post)
        console.log("fetching")
    })
})
// Add Team
app.post('/teams', (req, res) => {
    var db = req.db
    var teamName = req.body.organization + " " + req.body.division + " " + req.body.sport
    var coach = req.body.coach
    var organization = req.body.organization
    var division = req.body.division
    var sport = req.body.sport
    var region = req.body.region


    var new_team = new Team({
        teamName: teamName,
        coach: coach,
        organization: organization,
        divison: division,
        sport: sport,
        region: region

    })

    new_team.save(function (error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true,
            message: 'Team saved successfully!',

        })
    })
})
// Update a Team
app.put('/teams/:teamName', (req, res) => {
    var db = req.db

    Team.findOne({
        teamName: req.params.teamName
    }, function (error, post) {
        if (error) {
            console.error(error)
        }
        post.published = req.body.published
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
// Delete a Team
app.delete('/teams/:id', (req, res) => {
    var db = req.db
    Team.remove({
        _id: req.params.id
    }, function (err, team) {
        if (err)
            res.send(err)
        res.send({
            success: true
        })
    })
})
/////////teambyorgandsprt!!!!
app.get('/teams/:orgName/:sport', (req, res) => {
    var db = req.db
    Team.find({
        organization: req.params.orgName,
        sport: req.params.sport
    }, 'teamName division display published', function (error, posts) {
        if (error) {
            console.error(error)
        }
        console.log(posts)
        res.send({
            teams: posts
        })
    }).sort('date').exec(function (err, docs) {})
})
//Org Only
app.get('/teamsbyorg/:orgName', (req, res) => {
    var db = req.db

    Team.find({
        organization: req.params.orgName
    }, 'teamName organization', function (error, posts) {

        if (error) {
            console.error(error)
        }

        res.send({
            teams: posts
        })
    })
})
///ORG ROUTES
// Fetch all Orgs
app.get('/orgs', (req, res) => {
    Org.find({}, 'orgName city', function (error, posts) {
        if (error) {
            console.error(error)
        }
        res.send({
            orgs: posts
        })
    }).sort().exec(function (err, docs) {})
})
// Add Org
app.post('/orgs', (req, res) => {
    var db = req.db
    var orgName = req.body.orgName
    var new_org = new Org({
        orgName: orgName
    })

    new_org.save(function (error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true,
            message: 'Organization saved successfully!'
        })
    })
})
// Fetch single Org
app.get('/orgs/:orgName', (req, res) => {
    var db = req.db
    Org.find({
        orgName: req.params.orgName
    }, function (error, post) {
        if (error) {
            console.error(error)
        }
        res.send(post)
        console.log("fetching org")
    })
})
// Update a Org
app.put('/orgs/:orgName', (req, res) => {
    var db = req.db
    Org.findOne({
        orgName: req.params.orgName
    }, function (error, post) {
        if (error) {
            console.error(error)
        }

        post.orgName = req.params.orgName
        console.log(req.body.address)
        post.streetAddress = req.body.streetAddress
        post.addressLine2 = req.body.addressLine2
        post.city = req.body.city
        post.state = req.body.state
        post.zip = req.body.zip
        post.contacts = req.body.contacts
        post.gymLocations = req.body.gymLocations
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

// Delete a Org
app.delete('/orgs/:orgName', (req, res) => {
    var db = req.db
    Org.remove({
        orgName: req.params.orgName
    }, function (err, post) {
        if (err)
            res.send(err)
        res.send({
            success: true
        })
    })
})

//Regions
// Fetch all Regions
app.get('/regions', (req, res) => {
    Region.find({}, 'regionName', function (error, posts) {
        if (error) {
            console.error(error)
        }
        res.send({
            regions: regions
        })
    }).sort().exec(function (err, docs) {})
})
// Add Region
app.post('/regions', (req, res) => {
    var db = req.db
    var regionName = req.body.regionName
    var new_region = new Region({
        regionName: regionName
    })

    new_region.save(function (error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true,
            message: 'Regionanization saved successfully!'
        })
    })
})
// Fetch single Region
app.get('/regions/:regionName', (req, res) => {
    var db = req.db
    Region.find({
        regionName: req.params.regionName
    }, 'regionName', function (error, post) {
        if (error) {
            console.error(error)
        }
        res.send(post)
        console.log("fetching region")
    })
})
// Update a Region
app.put('/regions/:regionName', (req, res) => {
    var db = req.db
    Region.findOne({
        regionName: req.params.regionName
    }, 'regionName', function (error, post) {
        if (error) {
            console.error(error)
        }

        post.regionName = req.body.regionName
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
// Delete a Region
app.delete('/regions/:regionName', (req, res) => {
    var db = req.db
    Region.remove({
        regionName: req.params.regionName
    }, function (err, post) {
        if (err)
            res.send(err)
        res.send({
            success: true
        })
    })
})

///Sites Routes
// Fetch all Sites
app.get('/sites', (req, res) => {
    Site.find({}, 'siteName', function (error, posts) {
        if (error) {
            console.error(error)
        }
        res.send({
            sites: posts
        })
    }).sort().exec(function (err, docs) {})
})
// Add Site
app.post('/sites', (req, res) => {
    var db = req.db
    var siteName = req.body.siteName
    var organization = req.body.organization
    var address = req.body.address
    var new_site = new Site({
        siteName: siteName,
        organization: organization,
        address: address
    })

    new_site.save(function (error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true,
            message: 'Game Site saved successfully!'
        })
    })
})
// Fetch single Site
app.get('/sites/:siteName', (req, res) => {
    var db = req.db
    Site.find({
        siteName: req.params.siteName
    }, 'siteName', function (error, post) {
        if (error) {
            console.error(error)
        }
        res.send(post)
        console.log("fetching site")
    })
})
// Update a Site
app.put('/sites/:siteName', (req, res) => {
    var db = req.db
    Site.findOne({
        siteName: req.params.siteName
    }, 'siteName', function (error, post) {
        if (error) {
            console.error(error)
        }

        post.siteName = req.body.siteName
        post.organization = req.body.organization
        post.address = req.body.address
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
// Delete a Site
app.delete('/sites/:siteName', (req, res) => {
    var db = req.db
    Site.remove({
        siteName: req.params.siteName
    }, function (err, post) {
        if (err)
            res.send(err)
        res.send({
            success: true
        })
    })
})
//Sport Routes
// Fetch all Sports
app.get('/sports', (req, res) => {
    Sport.find({}, 'sport', function (error, posts) {
        if (error) {
            console.error(error)
        }
        res.send({
            sports: posts
        })
    }).sort().exec(function (err, docs) {})
})
// Add Sport
app.post('/sports', (req, res) => {
    var db = req.db
    var sport = req.body.sport
    var new_sport = new Sport({
        sport: sport
    })

    new_sport.save(function (error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true,
            message: 'Sport saved successfully!'
        })
    })
})
app.delete('/sports/:_id', (req, res) => {
    var db = req.db
    Sport.remove({
        _id: req.params._id
    }, function (err, post) {
        if (err)
            res.send(err)
        res.send({
            success: true
        })
    })
})
//Div Routes
// Fetch all Divs
app.get('/divs', (req, res) => {
    Div.find({}, 'divName', function (error, posts) {
        if (error) {
            console.error(error)
        }
        res.send({
            divs: posts
        })
    }).sort().exec(function (err, docs) {})
})
// Add Div
app.post('/divs', (req, res) => {
    var db = req.db
    var divName = req.body.divName
    var new_div = new Div({
        divName: divName
    })

    new_div.save(function (error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true,
            message: 'Div saved successfully!'
        })
    })
})
// Fetch single Div
app.get('/divs/:divName', (req, res) => {
    var db = req.db
    Div.find({
        divName: req.params.divName
    }, 'divName', function (error, post) {
        if (error) {
            console.error(error)
        }
        res.send(post)
        console.log("fetching div")
    })
})
// Update a Div
app.put('/divs/:divName', (req, res) => {
    var db = req.db
    Div.findOne({
        divName: req.params.divName
    }, 'divName', function (error, post) {
        if (error) {
            console.error(error)
        }

        post.divName = req.body.divName
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
// Delete a Div
app.delete('/divs/:_id', (req, res) => {
    var db = req.db
    Div.remove({
        _id: req.params._id
    }, function (err, post) {
        if (err)
            res.send(err)
        res.send({
            success: true
        })
    })
})

//Player Routes
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
    Player.find({
        playerName: req.params.playerName
    }, 'playerName', function (error, post) {
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
    Player.findOne({
        playerName: req.params.playerName
    }, 'playerName', function (error, post) {
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
