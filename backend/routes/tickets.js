const express   = require("express")
const router    = express.Router()

const ticketController = require("../app/api/controllers/tickets")

router.post("/createticket", ticketController.create)
router.get("/getallticketlist", ticketController.getAll)
router.get("/getraisedticketlist", ticketController.getAllRaised)
router.get("/getassignedticketlist", ticketController.getAllAssigned)
router.get("/getdepartmentotherticketlist", ticketController.getDepartmentWiseAllOther)
router.get("/getsiteotherticketlist", ticketController.getSiteGeneratedAllOther)
router.get("/getticketdetailslist/:ticket_id", ticketController.getTicketDetails)
router.put("/updateticket/:ticket_id", ticketController.update)
router.put("/updateunsolve/:ticket_id", ticketController.updateUnsolved)

module.exports = router