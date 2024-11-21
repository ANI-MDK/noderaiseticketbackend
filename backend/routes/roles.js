const express   = require("express")
const router    = express.Router()

const roleController = require("../app/api/controllers/roles")

router.get("/getrolelist/:role_type", roleController.getAll)
router.post("/createrole", roleController.create)
router.put("/updaterole/:role_id", roleController.update)
router.get("/deleterole/:role_id", roleController.delete)

module.exports = router