const express       = require("express")
const cors          = require("cors")
const bodyParser    = require("body-parser")
const fs            = require("fs")

const config        = require("./config/config")
const login         = require("./routes/login")
const verify        = require("./app/api/middlewares/verification")
const site          = require("./routes/sites")
const role          = require("./routes/roles")
const department    = require("./routes/departments")
const user          = require("./routes/users")

const app = express()

const PORT  = config.PORT || 3000
const ENV   = config.ENV

app.listen(PORT, () => {
    console.log(ENV + " server is up and running on " + PORT + " port.")
})

global.user_info = null

app.use(cors({
    origin: ["http://192.168.1.81:5172","http://192.168.1.128:3000"],
    exposedHeaders: ["Authorization"],
    credentials: true,
    methods: ["GET","POST","PUT"]
}))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use("/login", login)

app.use("/site", verify.tokenAuth, site)

app.use("/role", verify.tokenAuth, role)

app.use("/department", verify.tokenAuth, department)

app.use("/user", verify.tokenAuth, user)

app.use((err, req, res, next) => {
    const logErrorMessage = `
    Error: ${err.message}
    Method: ${req.method}
    URL: ${req.originalUrl}
    Date & Time: ${new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString()}
    Stack: ${err.stack}

    ------------------------------------------------------------------------------------------------------------`
    fs.appendFile(__dirname+"/logs/"+config.ERROR_LOG_FILE, logErrorMessage, (fsErr) => {
        if(fsErr) {
            console.error("Failed to write to log file: ", fsErr)
        }
    })
    res.json({status: "error", message: "Internal server error"})
})