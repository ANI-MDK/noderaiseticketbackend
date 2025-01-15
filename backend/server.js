const express       = require("express")
const cors          = require("cors")
const bodyParser    = require("body-parser")
const fs            = require("fs")

const config        = require("./config/config")
const login         = require("./routes/login")
const verify        = require("./app/api/middlewares/verification")
const dashboard     = require("./routes/dashboard")
const site          = require("./routes/sites")
const role          = require("./routes/roles")
const department    = require("./routes/departments")
const user          = require("./routes/users")
const ticket        = require("./routes/tickets")

const app = express()

const PORT  = config.PORT || 3000
const ENV   = config.ENV

app.listen(PORT, () => {
    console.log(ENV + " server is up and running on " + PORT + " port.")
})

global.user_info = null

app.use(cors({
    origin: ["http://192.168.1.128:5172"],
    exposedHeaders: ["Authorization"],
    credentials: true,
    methods: ["GET","POST","PUT"]
}))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static("public"))

app.use("/uploads", express.static("uploads"))

const nodemailer = require('nodemailer')
app.use('/send-email', async (req, res) => {
    try {
        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            host: config.EMAIL_HOST,
            port: config.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASS,
            },
        });

        const to = "amodak.it@dril.net.in, anirbanmodak7@gmail.com"
        const cc = "rsadhu.it@dril.net.in, spatra.it@dril.net.in"
        const subject = "New Ticket Raised To Your Department"
        const html = "<h1>Welcome!</h1><p>Thank you for joining our service.</p><p><strong>Enjoy!</strong></p>"

        // Email options
        const mailOptions = {
            from: `"Your App" <admin@dril.net.in>`, // Sender address
            to, // List of recipients
            cc,
            subject, // Subject line
            html, // Plain text body
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Email sent successfully!',
            info,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
})

app.use("/login", login)

app.use("/dashboard", verify.tokenAuth, dashboard)

app.use("/site", verify.tokenAuth, site)

app.use("/role", verify.tokenAuth, role)

app.use("/department", verify.tokenAuth, department)

app.use("/user", verify.tokenAuth, user)

app.use("/ticket", verify.tokenAuth, ticket)

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