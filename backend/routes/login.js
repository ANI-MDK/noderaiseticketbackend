const express   = require("express")
const router    = express.Router()

const loginController = require("../app/api/controllers/login")

router.post("/auth", loginController.authenticate)

module.exports = router