const express   = require("express")
const router    = express.Router()

const userController = require("../app/api/controllers/users")

router.get("/getuserlist", userController.getAll)
router.get("/getalluser/:department_id", userController.getDepartmentWiseActiveUser)
router.post("/createuser", userController.create)
router.put("/updateuser/:user_id", userController.update)
router.put("/updateuserpassword/:user_id", userController.updatePassword)
router.get("/updateuserstatus/:user_id", userController.changeStatus)
router.get("/deleteuser/:user_id", userController.delete)

module.exports = router