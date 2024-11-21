const express   = require("express")
const router    = express.Router()

const departmentController = require("../app/api/controllers/departments")

router.get("/getdepartmentlist/:department_type", departmentController.getAll)
router.post("/createdepartment", departmentController.create)
router.put("/updatedepartment/:department_id", departmentController.update)
router.put("/updateassigner/:department_id", departmentController.updateDepartmentWiseAssigner)
router.get("/deletedepartment/:department_id", departmentController.delete)

module.exports = router