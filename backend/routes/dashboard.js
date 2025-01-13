const express   = require("express")
const router    = express.Router()

const dashboardController = require("../app/api/controllers/dashboard")

router.get("/getallticketcount", dashboardController.getAllCounts)

module.exports = router