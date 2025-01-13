const db = require("../../../config/db")

module.exports = {
    getAllCounts: (req, res, next) => {
        const sql = `
        SELECT 
            COUNT(*) AS total_tickets,
            SUM(ticket_status = 'Open') AS total_open_tickets,
            SUM(ticket_status = 'In Progress') AS total_in_progress_tickets,
            SUM(ticket_status = 'Close') AS total_close_tickets
        FROM 
            tbl_tickets
        WHERE 
            is_deleted = '0'`
        db.query(sql, (err, totalCountDetails) => {
            if(err) {
                next(err)
            }
            else {
                res.json({status: "success", message: "All ticket count", data: totalCountDetails})
            }
        })
    }
}