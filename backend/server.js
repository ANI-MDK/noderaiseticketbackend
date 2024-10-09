const express       = require("express")
const cors          = require("cors")
const bodyParser    = require("body-parser")

// const bcrypt = require('bcrypt')

const config        = require("./config/config")
const pool          = require("./config/database")
const login         = require("./routes/login")
const verify        = require("./app/api/middlewares/verification")
const site          = require("./routes/sites")
const role          = require("./routes/roles")
const department    = require("./routes/departments")
const user          = require("./routes/users")

global.user_info = null

const app   = express()

app.use(cors({
    origin: ["http://192.168.1.128:3000"],
    exposedHeaders: ["Authorization"],
    credentials: true,
    methods: ["GET","POST","PUT"]
}))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}))

const PORT  = config.PORT || 3000
const ENV   = config.ENV

app.listen(PORT, () => {
    console.log(ENV + " server is up and running on " + PORT + " port.")
})

pool.getConnection((err, connection) => {
    connection.release()
    if(err) {
        throw err;
    }
    else {
        console.log("Connected to MySQL Server!")

        // console.log(bcrypt.hashSync("Admin@Dril", Number(config.SALT_ROUND)))
        // connection.query("SELECT COUNT(*) AS site_count FROM tbl_sites WHERE site_name='Pushkar' AND is_deleted='0'", (err, isExist) => {
        //     if(err) {
        //         throw err;
        //     }
        //     else {
        //         console.log(isExist)
        //         console.log(isExist[0].site_count)
        //     }
        // })
    }
})

app.get("/", (req , res) => {
    res.send("Welcome to the Raise Ticket REST API server")
})

app.use("/login", login)

app.use("/site", verify.tokenAuth, site)

app.use("/role", verify.tokenAuth, role)

app.use("/department", verify.tokenAuth, department)

app.use("/user", verify.tokenAuth, user)

app.use((req, res, next) => {
    let err = new Error("Not found")
    err.status = 404
    next(err)
})

app.use((err, req, res) => {
    if(err.status === 404)
        res.status(404).json({message:err})
    else
        res.status(500).json({message:"Something looks wrong - "+err})
})