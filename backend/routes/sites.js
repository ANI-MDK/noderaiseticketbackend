const express   = require("express")
const router    = express.Router()

const siteController = require("../app/api/controllers/sites")

router.get("/getsitelist/:site_type", siteController.getAll)
router.post("/createsite", siteController.create)
router.put("/updatesite/:site_id", siteController.update)
router.get("/deletesite/:site_id", siteController.delete)

module.exports = router