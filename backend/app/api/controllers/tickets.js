const db            = require("../../../config/db")
const uploadFiles   = require("../middlewares/upload_files")
const transporter   = require("../middlewares/mailer")
const multer        = require("multer")
const fs            = require("fs")
const config        = require("../../../config/config") 
const path          = require("path")

const sendEmail = async (toMailId, ccMailId, mailSubject, mailBody) => {
    const info = await transporter.sendMail({
        from: `"Ticket Raise System" <admin@dril.net.in>`,
        to: toMailId,
        cc: (ccMailId !== null) ? ccMailId : undefined,
        subject: mailSubject,
        html: mailBody
    })
}

const removeUploadedFiles = (files) => {
    if(!files || !files.length) {
        return
    }
    else {
        files.forEach((file) => {
            if(fs.existsSync(file.path)) {
                fs.unlinkSync(file.path)
            }
        })
    }
}

const insertTicket = (req, res, next) => {
    const assignedById = global.user_info[0].id
    const assignedByName = global.user_info[0].user_name.trim()
    const assignedByEmail = global.user_info[0].user_email.trim()
    const assignedByDepartmentId = global.user_info[0].department_id
    const assignedByRoleId = global.user_info[0].role_id
    const siteId = req.body.site_id || 0
    const siteName = req.body.site_name.trim() || ""
    const departmentId = req.body.department_id || 0
    const departmentName = req.body.department_name.trim() || ""
    const isAssignToUser = req.body.is_assign_to_user || 0
    const assignedToId = req.body.current_assigner_id 
    const assignedToName = req.body.current_assigner_name.trim() || ""
    const assignedToEmail = req.body.current_assigner_email.trim() || ""
    const assignedToDepartmentId = req.body.current_assigner_department_id || 0
    const assignedToRoleId = req.body.current_assigner_role_id || 0
    const ticketTitle = req.body.ticket_title.trim() || ""
    const ticketPriority = req.body.ticket_priority.trim() || ""
    const ticketDescription = req.body.ticket_description.trim() || ""
    
    if(siteName !== "" && departmentName !== "" && assignedToId > 0 && assignedToName !== "" && assignedToEmail !== "" && assignedToDepartmentId > 0 && assignedToRoleId > 0 && (departmentId === assignedToDepartmentId) && (isAssignToUser == 0 || isAssignToUser == 1)) {
        if(siteId > 0 && departmentId > 0 && ticketTitle !== "" && ticketPriority !== "" && ticketDescription !== "") {
            const now = new Date()
            const year = now.getFullYear()
            const month = now.getMonth() + 1
            const financialYear = month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`
            const fyAbbr = financialYear.split('-').map((yr) => yr.slice(-2)).join('')
            let newTicketNumber = ""
            db.query("SELECT * FROM tbl_ticket_numbers WHERE financial_year="+db.escape(financialYear), (err, ticketNoInfo) => {
                if(err) {
                    removeUploadedFiles(req.files)
                    next(err)
                }
                else {
                    const siteAbbr = siteName.substring(0, 3).toUpperCase()
                    if(ticketNoInfo.length === 0) {
                        db.execute("INSERT INTO tbl_ticket_numbers SET financial_year="+db.escape(financialYear)+", last_number='1'")
                        newTicketNumber = `${siteAbbr}${fyAbbr}1000001`
                    }
                    else {
                        const lastNumber = ticketNoInfo[0].last_number + 1
                        db.execute("UPDATE tbl_ticket_numbers SET last_number="+db.escape(lastNumber)+" WHERE financial_year="+db.escape(financialYear))
                        newTicketNumber = `${siteAbbr}${fyAbbr}${(1000000 + lastNumber).toString()}`
                    }
                    let sql = ""
                    let ticketAction = ""
                    let printableBody = ""
                    if(isAssignToUser == "1") {
                        ticketAction = "Assigned"
                        sql = `
                        INSERT INTO 
                            tbl_tickets 
                        SET 
                            ticket_number=${db.escape(newTicketNumber)}, 
                            from_site_id=${db.escape(siteId)}, 
                            to_department_id=${db.escape(departmentId)}, 
                            ticket_title=${db.escape(ticketTitle)}, 
                            ticket_priority=${db.escape(ticketPriority)}, 
                            raised_by=${db.escape(assignedById)}, 
                            last_assigned_by=${db.escape(assignedById)}, 
                            last_assigned_to=${db.escape(assignedToId)}, 
                            ticket_status='In Progress', 
                            last_action='Assigned'`
                        printableBody = `This mail is to notify you that a new ticket has been assigned to you by <strong>${assignedByName}</strong>.`
                    }
                    else {
                        ticketAction = "Opened"
                        sql = `
                        INSERT INTO 
                            tbl_tickets 
                        SET 
                            ticket_number=${db.escape(newTicketNumber)}, 
                            from_site_id=${db.escape(siteId)}, 
                            to_department_id=${db.escape(departmentId)}, 
                            ticket_title=${db.escape(ticketTitle)}, 
                            ticket_priority=${db.escape(ticketPriority)}, 
                            raised_by=${db.escape(assignedById)}, 
                            last_assigned_by=${db.escape(assignedById)}, 
                            last_assigned_to=${db.escape(assignedToId)}, 
                            ticket_status='Open', 
                            last_action='Opened'`
                        printableBody = `This mail is to notify you that a new ticket has been opened to <strong>${departmentName}</strong> department by <strong>${assignedByName}</strong>.`
                    } 
                    db.query(sql, (err, ticketInfo) => {
                        if(err) {
                            removeUploadedFiles(req.files)
                            next(err)
                        }
                        else {
                            const ticketIdCreated = ticketInfo.insertId
                            db.query("INSERT INTO tbl_ticket_details SET ticket_id="+db.escape(ticketIdCreated)+", ticket_comment="+db.escape(ticketDescription)+", ticket_action="+db.escape(ticketAction)+", action_by="+db.escape(assignedById)+", action_by_role_id="+db.escape(assignedByRoleId)+", action_by_department_id="+db.escape(assignedByDepartmentId)+", action_to="+db.escape(assignedToId)+", action_to_role_id="+db.escape(assignedToRoleId)+", action_to_department_id="+db.escape(assignedToDepartmentId), (err, ticketDetailsInfo) => {
                                if(err) {
                                    removeUploadedFiles(req.files)
                                    db.execute("DELETE FROM tbl_tickets WHERE id="+db.escape(ticketIdCreated))
                                    next(err)
                                }
                                else {
                                    if(req.files.length > 0) {
                                        const ticketDetailsIdCreated = ticketDetailsInfo.insertId
                                        const fileDetails = req.files.map((file) => [
                                            ticketDetailsIdCreated,
                                            file.filename,
                                            file.mimetype,
                                            assignedById,
                                            file.originalname
                                        ])
                                        
                                        const sql = `INSERT INTO tbl_ticket_attachments (ticket_details_id, uploaded_file_name, uploaded_file_type, uploaded_by, uploaded_file_original_name) VALUES ?`
                                        db.query(sql, [fileDetails], (err, ticketAttachmentInfo) => {
                                            if(err) {
                                                removeUploadedFiles(req.files)
                                                db.execute("DELETE FROM tbl_tickets WHERE id="+db.escape(ticketIdCreated))
                                                db.execute("DELETE FROM tbl_ticket_details WHERE id="+db.escape(ticketDetailsIdCreated))
                                                next(err)
                                            }
                                            else {
                                                const toMailId = assignedToEmail
                                                const ccMailId = assignedByEmail
                                                const mailSubject = `Ticket No. ${newTicketNumber} ${ticketAction}`
                                                const mailBody = `
                                                <!DOCTYPE html>
                                                <html>
                                                    <head>
                                                        <meta charset="UTF-8">
                                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                        <style>
                                                            body {
                                                                font-family: Arial, sans-serif;
                                                                margin: 0;
                                                                padding: 0;
                                                                background-color: #f4f4f4;
                                                            }
                                                            .email-container {
                                                                max-width: 600px;
                                                                margin: 20px auto;
                                                                background-color: #ffffff;
                                                                border: 1px solid #dddddd;
                                                                border-radius: 5px;
                                                                overflow: hidden;
                                                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                                                            }
                                                            .email-header {
                                                                background-color: #4CAF50;
                                                                color: #ffffff;
                                                                text-align: center;
                                                                padding: 15px;
                                                            }
                                                            .email-header h1 {
                                                                margin: 0;
                                                                font-size: 20px;
                                                            }
                                                            .email-body {
                                                                padding: 0px;
                                                                color: #333333;
                                                                line-height: 1.6;
                                                                margin: 10px;
                                                            }
                                                            .email-body h2 {
                                                                margin: 0 0 10px;
                                                                font-size: 18px;
                                                            }
                                                            .email-footer {
                                                                background-color: #f9f9f9;
                                                                text-align: center;
                                                                padding: 10px;
                                                                font-size: 12px;
                                                                color: #777777;
                                                            }
                                                            a {
                                                                color: #4CAF50;
                                                                text-decoration: none;
                                                            }
                                                            .button {
                                                                display: inline-block;
                                                                background-color: #4CAF50;
                                                                color: #ffffff;
                                                                text-decoration: none;
                                                                padding: 10px 20px;
                                                                border-radius: 3px;
                                                                font-size: 14px;
                                                            }
                                                            .button:hover {
                                                                background-color: #45a049;
                                                            }
                                                            @media only screen and (max-width: 600px) {
                                                                .email-body, .email-header, .email-footer {
                                                                    padding: 15px;
                                                                    margin: 20px auto;
                                                                }

                                                                .button {
                                                                    font-size: 12px;
                                                                    padding: 8px 16px;
                                                                }
                                                            }
                                                        </style>
                                                    </head>
                                                    <body>
                                                        <div class="email-container">
                                                            <div class="email-header">
                                                                <h1>New Ticket Notification</h1>
                                                            </div>
                                                            <div class="email-body">
                                                                <h2>Hello ${assignedToName},</h2>
                                                                <p>${printableBody}</p>
                                                                <p><strong>Issue Title:</strong> ${ticketTitle}</p>
                                                                <p><strong>Ticket Number:</strong> ${newTicketNumber}</p>
                                                                <p>You can view more details and manage this ticket by visiting the Ticket Raise System using the link below:</p>
                                                                <p style="text-align: center;"><a href="${config.FRONTEND_URL}" class="button">Click Here</a></p>
                                                                <p>Best regards,<br/>DRIL - Ticket Raise System</p>
                                                            </div>
                                                            <div class="email-footer">
                                                                <p>This is an automated email. Please do not reply to this email.</p>
                                                                <p>&copy; Esteem Infrastructure Pvt Ltd. All rights reserved.</p>
                                                            </div>
                                                        </div>
                                                    </body>
                                                </html>`
                                                
                                                sendEmail(toMailId, ccMailId, mailSubject, mailBody)
                                                res.json({status: "success", message: "Ticket successfully created"})
                                            }
                                        })
                                    }
                                    else {
                                        const toMailId = assignedToEmail
                                        const ccMailId = assignedByEmail
                                        const mailSubject = `Ticket No. ${newTicketNumber} ${ticketAction}`
                                        const mailBody = `
                                        <!DOCTYPE html>
                                        <html>
                                            <head>
                                                <meta charset="UTF-8">
                                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                <style>
                                                    body {
                                                        font-family: Arial, sans-serif;
                                                        margin: 0;
                                                        padding: 0;
                                                        background-color: #f4f4f4;
                                                    }
                                                    .email-container {
                                                        max-width: 600px;
                                                        margin: 20px auto;
                                                        background-color: #ffffff;
                                                        border: 1px solid #dddddd;
                                                        border-radius: 5px;
                                                        overflow: hidden;
                                                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                                                    }
                                                    .email-header {
                                                        background-color: #4CAF50;
                                                        color: #ffffff;
                                                        text-align: center;
                                                        padding: 15px;
                                                    }
                                                    .email-header h1 {
                                                        margin: 0;
                                                        font-size: 20px;
                                                    }
                                                    .email-body {
                                                        padding: 0px;
                                                        color: #333333;
                                                        line-height: 1.6;
                                                        margin: 10px;
                                                    }
                                                    .email-body h2 {
                                                        margin: 0 0 10px;
                                                        font-size: 18px;
                                                    }
                                                    .email-footer {
                                                        background-color: #f9f9f9;
                                                        text-align: center;
                                                        padding: 10px;
                                                        font-size: 12px;
                                                        color: #777777;
                                                    }
                                                    a {
                                                        color: #4CAF50;
                                                        text-decoration: none;
                                                    }
                                                    .button {
                                                        display: inline-block;
                                                        background-color: #4CAF50;
                                                        color: #ffffff;
                                                        text-decoration: none;
                                                        padding: 10px 20px;
                                                        border-radius: 3px;
                                                        font-size: 14px;
                                                    }
                                                    .button:hover {
                                                        background-color: #45a049;
                                                    }
                                                    @media only screen and (max-width: 600px) {
                                                        .email-body, .email-header, .email-footer {
                                                            padding: 15px;
                                                            margin: 20px auto;
                                                        }

                                                        .button {
                                                            font-size: 12px;
                                                            padding: 8px 16px;
                                                        }
                                                    }
                                                </style>
                                            </head>
                                            <body>
                                                <div class="email-container">
                                                    <div class="email-header">
                                                        <h1>New Ticket Notification</h1>
                                                    </div>
                                                    <div class="email-body">
                                                        <h2>Hello ${assignedToName},</h2>
                                                        <p>${printableBody}</p>
                                                        <p><strong>Issue Title:</strong> ${ticketTitle}</p>
                                                        <p><strong>Ticket Number:</strong> ${newTicketNumber}</p>
                                                        <p>You can view more details and manage this ticket by visiting the Ticket Raise System using the link below:</p>
                                                        <p style="text-align: center;"><a href="${config.FRONTEND_URL}" class="button">Click Here</a></p>
                                                        <p>Best regards,<br/>DRIL - Ticket Raise System</p>
                                                    </div>
                                                    <div class="email-footer">
                                                        <p>This is an automated email. Please do not reply to this email.</p>
                                                        <p>&copy; Esteem Infrastructure Pvt Ltd. All rights reserved.</p>
                                                    </div>
                                                </div>
                                            </body>
                                        </html>`
                                        
                                        sendEmail(toMailId, ccMailId, mailSubject, mailBody)
                                        res.json({status: "success", message: "Ticket raised successfully"})
                                    }
                                }
                            })
                        }
                    })
                }
            })

        }
        else {
            removeUploadedFiles(req.files)
            res.json({status: "error", message: "Mandetory field error"})
        }
    }
    else {
        removeUploadedFiles(req.files)
        res.json({status: "error", message: "Something went wrong"})
    }
}

const updateTicket = (req, res, next, ticketDetailsIdCreated) => {
    const ticketAction = req.body.ticket_action.trim()
    const actionByName = global.user_info[0].user_name.trim()
    const actionByEmail = global.user_info[0].user_email.trim()
    const actionToName = req.body.current_assigner_name.trim()
    const actionToEmail = req.body.current_assigner_email.trim()
    const raiseByName = req.body.ticket_raise_by_name.trim()
    const raiseByEmail = req.body.ticket_raise_by_email.trim()
    const ticketNumber = req.body.ticket_number.trim()
    const ticketTitle = req.body.ticket_title.trim() || ""
    if(ticketAction !== "Replied") {
        const ticketId = req.params.ticket_id || 0
        const actionById = global.user_info[0].id
        const actionByDepartmentId = global.user_info[0].department_id
        const actionByRoleId = global.user_info[0].role_id
        const isAssignToUser = req.body.is_assign_to_user
        const actionToId = req.body.current_assigner_id 
        const actionToDepartmentId = req.body.current_assigner_department_id
        const actionToDepartmentName = req.body.current_assigner_department_name.trim()
        const actionToRoleId = req.body.current_assigner_role_id
        const ticketComment = req.body.ticket_comment.trim()
        let updateSql = ""
        if(isAssignToUser == "1") {
            updateSql = `
            UPDATE 
                tbl_tickets
            SET
                last_assigned_by=${db.escape(actionById)},
                last_assigned_to=${db.escape(actionToId)},
                ticket_status='In Progress',
                last_action=${db.escape(ticketAction)}
            WHERE
                id=${db.escape(ticketId)}`
        }
        else {
            let ticketStatus = ""
            switch(ticketAction) {
                case "Resolved":    ticketStatus = "Resolve"
                                    break
                case "Closed":      ticketStatus = "Close"
                                    break
            }
            updateSql = `
            UPDATE 
                tbl_tickets
            SET
                ticket_status=${db.escape(ticketStatus)},
                last_action=${db.escape(ticketAction)}
            WHERE
                id=${db.escape(ticketId)}`
        }
        db.query(updateSql, (err, ticketUpdateInfo) => {
            if(err) {
                removeUploadedFiles(req.files)
                db.execute("DELETE FROM tbl_ticket_details WHERE id="+db.escape(ticketDetailsIdCreated))
                db.execute("DELETE FROM tbl_ticket_attachments WHERE ticket_details_id="+db.escape(ticketDetailsIdCreated))
                next(err)
            }
            else {
                let ccMailId = actionByEmail
                let toMailId = ""
                let recipientName = ""
                let printableBody = ""
                switch(ticketAction) {
                    case "Assigned":
                    case "Reassigned":
                        if(actionByEmail == actionToEmail) {
                            toMailId = raiseByEmail
                            recipientName = raiseByName
                            printableBody = `<p>This mail is to notify you that <strong>${actionByName}</strong> has ${ticketAction} to the following ticket:</p>`
                        }
                        else {
                            toMailId = actionToEmail
                            recipientName = actionToName
                            ccMailId = `${actionByEmail}, ${raiseByEmail}`
                            printableBody = `<p>This mail is to notify you that <strong>${actionByName}</strong> has ${ticketAction} you the following ticket:</p>`
                        }
                        break

                    case "Resolved":
                        toMailId = raiseByEmail
                        recipientName = raiseByName
                        printableBody = `<p>This mail is to notify you that <strong>${actionByName}</strong> has ${ticketAction} the following ticket:</p>`
                        break

                    case "Closed":
                    case "Reopened":
                        toMailId = actionToEmail
                        recipientName = actionToName
                        ccMailId = raiseByEmail
                        printableBody = `<p>This mail is to notify you that the following ticket has ${ticketAction} by <strong>${actionByName}</strong>:</p>`
                        break
                }
                const mailSubject = `Ticket no. ${ticketNumber} - ${ticketAction}`
                const mailBody = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 0;
                                padding: 0;
                                background-color: #f4f4f4;
                            }
                            .email-container {
                                max-width: 600px;
                                margin: 20px auto;
                                background-color: #ffffff;
                                border: 1px solid #dddddd;
                                border-radius: 5px;
                                overflow: hidden;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            }
                            .email-header {
                                background-color: #4CAF50;
                                color: #ffffff;
                                text-align: center;
                                padding: 15px;
                            }
                            .email-header h1 {
                                margin: 0;
                                font-size: 20px;
                            }
                            .email-body {
                                padding: 0px;
                                color: #333333;
                                line-height: 1.6;
                                margin: 10px;
                            }
                            .email-body h2 {
                                margin: 0 0 10px;
                                font-size: 18px;
                            }
                            .email-footer {
                                background-color: #f9f9f9;
                                text-align: center;
                                padding: 10px;
                                font-size: 12px;
                                color: #777777;
                            }
                            a {
                                color: #4CAF50;
                                text-decoration: none;
                            }
                            .button {
                                display: inline-block;
                                background-color: #4CAF50;
                                color: #ffffff;
                                text-decoration: none;
                                padding: 10px 20px;
                                border-radius: 3px;
                                font-size: 14px;
                            }
                            .button:hover {
                                background-color: #45a049;
                            }
                            @media only screen and (max-width: 600px) {
                                .email-body, .email-header, .email-footer {
                                    padding: 15px;
                                    margin: 20px auto;
                                }

                                .button {
                                    font-size: 12px;
                                    padding: 8px 16px;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="email-header">
                                <h1>Update Ticket Notification</h1>
                            </div>
                            <div class="email-body">
                                <h2>Hello ${recipientName},</h2>
                                ${printableBody}
                                <p><strong>Ticket Title:</strong> ${ticketTitle}</p>
                                <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
                                <p>You can view more details and manage this ticket by visiting the Ticket Raise System using the link below:</p>
                                <p style="text-align: center;"><a href="${config.FRONTEND_URL}" class="button">Click Here</a></p>
                                <p>Best regards,<br/>DRIL - Ticket Raise System</p>
                            </div>
                            <div class="email-footer">
                                <p>This is an automated email. Please do not reply to this email.</p>
                                <p>&copy; Esteem Infrastructure Pvt Ltd. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                </html>`
                sendEmail(toMailId, ccMailId, mailSubject, mailBody)
                res.json({status: "success", message: "Ticket successfully updated"})
            }
        })
    }
    else {
        let ccMailId = actionByEmail
        let toMailId = ""
        let recipientName = ""
        if(raiseByEmail == actionByEmail) {
            toMailId = actionToEmail
            recipientName = actionToName
        }
        else if(actionByEmail == actionToEmail) {
            toMailId = raiseByEmail
            recipientName = raiseByName
        }
        else {
            toMailId = actionToEmail
            recipientName = actionToName
            ccMailId = `${actionByEmail}, ${raiseByEmail}`
        }
        const mailSubject = `${ticketAction} to ticket no. ${ticketNumber}`
        const mailBody = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        border: 1px solid #dddddd;
                        border-radius: 5px;
                        overflow: hidden;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .email-header {
                        background-color: #4CAF50;
                        color: #ffffff;
                        text-align: center;
                        padding: 15px;
                    }
                    .email-header h1 {
                        margin: 0;
                        font-size: 20px;
                    }
                    .email-body {
                        padding: 0px;
                        color: #333333;
                        line-height: 1.6;
                        margin: 10px;
                    }
                    .email-body h2 {
                        margin: 0 0 10px;
                        font-size: 18px;
                    }
                    .email-footer {
                        background-color: #f9f9f9;
                        text-align: center;
                        padding: 10px;
                        font-size: 12px;
                        color: #777777;
                    }
                    a {
                        color: #4CAF50;
                        text-decoration: none;
                    }
                    .button {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: 3px;
                        font-size: 14px;
                    }
                    .button:hover {
                        background-color: #45a049;
                    }
                    @media only screen and (max-width: 600px) {
                        .email-body, .email-header, .email-footer {
                            padding: 15px;
                            margin: 20px auto;
                        }

                        .button {
                            font-size: 12px;
                            padding: 8px 16px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <h1>Update Ticket Notification</h1>
                    </div>
                    <div class="email-body">
                        <h2>Hello ${recipientName},</h2>
                        <p>This mail is to notify you that a new comment has been added by <strong>${actionByName}</strong> to the following ticket:</p>
                        <p><strong>Ticket Title:</strong> ${ticketTitle}</p>
                        <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
                        <p>You can view more details and manage this ticket by visiting the Ticket Raise System using the link below:</p>
                        <p style="text-align: center;"><a href="${config.FRONTEND_URL}" class="button">Click Here</a></p>
                        <p>Best regards,<br/>DRIL - Ticket Raise System</p>
                    </div>
                    <div class="email-footer">
                        <p>This is an automated email. Please do not reply to this email.</p>
                        <p>&copy; Esteem Infrastructure Pvt Ltd. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>`
        sendEmail(toMailId, ccMailId, mailSubject, mailBody)
        res.json({status: "success", message: "Ticket successfully updated"})
    }
}

module.exports = {
    create: (req, res, next) => {
        uploadFiles.array("issue_files", 5)(req, res, (err) => {
            if(err instanceof multer.MulterError) {
                removeUploadedFiles(req.files)
                next(err)
            }
            else if(err) {
                removeUploadedFiles(req.files)
                next(err)
            }
            else {
                if(global.user_info[0].is_admin_user) {
                    insertTicket(req, res, next)
                }
                else {
                    const userId = global.user_info[0].id
                    db.query("SELECT can_raise_new_ticket FROM tbl_users WHERE id="+db.escape(userId)+" AND is_active='1' AND is_deleted='0'", (err, permissionInfo) => {
                        if(err) {
                            removeUploadedFiles(req.files)
                            next(err)
                        }
                        else if(permissionInfo[0].can_raise_new_ticket) {
                            insertTicket(req, res, next)
                        }
                        else {
                            removeUploadedFiles(req.files)
                            res.json({status: "error", message: "Permission denied"})
                        }
                    })
                }
            }
        })
    },

    getAll: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            const sql = `
            SELECT
                t.id AS ticket_id,
                t.ticket_number AS ticket_number,
                t.ticket_title AS ticket_title, 
                t.ticket_priority AS ticket_priority, 
                t.ticket_status AS ticket_status, 
                t.created_at AS ticket_date, 
                t.last_action AS ticket_action, 
                t.from_site_id AS ticket_raise_from_site_id, 
                t.to_department_id AS ticket_raise_to_dept_id, 
                t.raised_by AS ticket_raise_by_id, 
                t.last_assigned_to AS ticket_assigned_to_id, 
                t.updated_at AS ticket_updated_on,
                s.site_name AS ticket_raise_from_site_name,
                d.department_name AS ticket_raise_to_dept_name,
                u.user_name AS ticket_raise_by_name, 
                u.user_email AS ticket_raise_by_email,
                u.department_id AS ticket_raise_by_dept_id, 
                u.role_id AS ticket_raise_by_role_id,
                us.user_name AS ticket_assigned_to_name, 
                us.user_email AS ticket_assigned_to_email,
                us.department_id AS ticket_assigned_to_dept_id, 
                dt.department_name AS ticket_assigned_to_dept_name,
                us.role_id AS ticket_assigned_to_role_id
            FROM 
                tbl_tickets t
            JOIN 
                tbl_sites s ON t.from_site_id = s.id
            JOIN 
                tbl_departments d ON t.to_department_id = d.id
            JOIN 
                tbl_users u ON t.raised_by = u.id
            JOIN 
                tbl_user_site_mapping usm ON u.id = usm.user_id AND t.from_site_id = usm.site_id
            JOIN 
                tbl_users us ON t.last_assigned_to = us.id
            JOIN 
                tbl_departments dt ON us.department_id = dt.id
            WHERE 
                t.is_deleted = '0'
            ORDER BY 
                t.updated_at DESC`

            db.query(sql, (err, ticketList) => {
                if(err) {
                    next(err)
                }
                else {
                    res.json({status: "success", message: "All ticket list", data: ticketList})
                }
            })
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    getAllRaised: (req, res, next) => {
        const userId = global.user_info[0].id
        const sql = `
        SELECT DISTINCT t.id AS ticket_id, 
            t.ticket_number AS ticket_number, 
            t.ticket_title AS ticket_title, 
            t.ticket_priority AS ticket_priority, 
            t.ticket_status AS ticket_status, 
            t.created_at AS ticket_date, 
            t.last_action AS ticket_action, 
            t.from_site_id AS ticket_raise_from_site_id, 
            t.to_department_id AS ticket_raise_to_dept_id, 
            t.raised_by AS ticket_raise_by_id, 
            t.last_assigned_to AS ticket_assigned_to_id, 
            t.updated_at AS ticket_updated_on, 
            s.site_name AS ticket_raise_from_site_name, 
            d.department_name AS ticket_raise_to_dept_name, 
            u.user_name AS ticket_raise_by_name, 
            u.user_email AS ticket_raise_by_email,
            u.department_id AS ticket_raise_by_dept_id, 
            u.role_id AS ticket_raise_by_role_id, 
            us.user_name AS ticket_assigned_to_name, 
            us.user_email AS ticket_assigned_to_email,
            us.department_id AS ticket_assigned_to_dept_id, 
            dt.department_name AS ticket_assigned_to_dept_name,
            us.role_id AS ticket_assigned_to_role_id
        FROM 
            tbl_tickets t
        JOIN 
            tbl_sites s ON t.from_site_id = s.id
        JOIN 
            tbl_departments d ON t.to_department_id = d.id
        JOIN 
            tbl_users u ON t.raised_by = u.id
        JOIN 
            tbl_user_site_mapping usm ON u.id = usm.user_id AND t.from_site_id = usm.site_id
        JOIN 
            tbl_users us ON t.last_assigned_to = us.id
        JOIN 
            tbl_departments dt ON us.department_id = dt.id
        WHERE 
            t.raised_by = ${db.escape(userId)}
            AND t.is_deleted = '0'
            AND u.is_active = '1'
            AND u.is_deleted = '0'
        ORDER BY 
            t.updated_at DESC`

        db.query(sql, (err, ticketList) => {
            if(err) {
                next(err)
            }
            else {
                res.json({status: "success", message: "Raised by me ticket list", data: ticketList})
            }
        })
    },

    getAllAssigned: (req, res, next) => {
        const userId = global.user_info[0].id
        const sql = `
        SELECT 
            DISTINCT t.id AS ticket_id, 
            t.ticket_number AS ticket_number, 
            t.ticket_title AS ticket_title, 
            t.ticket_priority AS ticket_priority, 
            t.ticket_status AS ticket_status, 
            t.created_at AS ticket_date,
            t.updated_at AS ticket_updated_on, 
            t.last_action AS ticket_action, 
            t.from_site_id AS ticket_raise_from_site_id, 
            s.site_name AS ticket_raise_from_site_name,
            t.to_department_id AS ticket_raise_to_dept_id, 
            d.department_name AS ticket_raise_to_dept_name,
            t.raised_by AS ticket_raise_by_id, 
            us.user_name AS ticket_raise_by_name,
            us.user_email AS ticket_raise_by_email,
            us.department_id AS ticket_raise_by_dept_id,
            us.role_id AS ticket_raise_by_role_id,
            t.last_assigned_to AS ticket_assigned_to_id,
            usr.user_name AS ticket_assigned_to_name,
            usr.user_email AS ticket_assigned_to_email,
            usr.department_id AS ticket_assigned_to_dept_id,
            dt.department_name AS ticket_assigned_to_dept_name,
            usr.role_id AS ticket_assigned_to_role_id,
            t.last_assigned_to = u.id AS is_last_assigned_to_user,
            d.current_assigner_id = u.id AS is_department_assigner
        FROM 
            tbl_tickets t
        JOIN 
            tbl_ticket_details td ON t.id = td.ticket_id
        JOIN 
            tbl_users u ON td.action_to = u.id AND td.action_to_department_id = u.department_id
        JOIN 
            tbl_departments d ON t.to_department_id = d.id
        JOIN
            tbl_sites s ON t.from_site_id = s.id
        JOIN
            tbl_users us ON t.raised_by = us.id
        Join
            tbl_users usr ON t.last_assigned_to = usr.id
        JOIN 
            tbl_departments dt ON u.department_id = dt.id
        WHERE 
            u.id = ${db.escape(userId)}
            AND u.is_active = '1'
            AND u.is_deleted = '0'
            AND t.is_deleted = '0'
        ORDER BY 
            t.updated_at DESC`

        db.query(sql, (err, ticketList) => {
            if(err) {
                next(err)
            }
            else {
                res.json({status: "success", message: "Assigned to me ticket list", data: ticketList})
            }
        })
    },

    getDepartmentWiseAllOther: (req, res, next) => {
        if("1" == global.user_info[0].can_track_department_tickets) {
            const userId = global.user_info[0].id
            const userDeptId = global.user_info[0].department_id
            const sql = `
            SELECT DISTINCT 
                t.id AS ticket_id, 
                t.ticket_number AS ticket_number, 
                t.ticket_title AS ticket_title, 
                t.ticket_priority AS ticket_priority, 
                t.ticket_status AS ticket_status, 
                t.created_at AS ticket_date,
                t.updated_at AS ticket_updated_on, 
                t.last_action AS ticket_action, 
                t.from_site_id AS ticket_raise_from_site_id,
                s.site_name AS ticket_raise_from_site_name,
                t.to_department_id AS ticket_raise_to_dept_id, 
                d.department_name AS ticket_raise_to_dept_name,
                t.raised_by AS ticket_raise_by_id, 
                us.user_name AS ticket_raise_by_name
            FROM 
                tbl_tickets t
            JOIN 
                tbl_departments d ON t.to_department_id = d.id
            JOIN
                tbl_sites s ON t.from_site_id = s.id
            JOIN
                tbl_users us ON t.raised_by = us.id
            WHERE 
                t.id NOT IN (
                    SELECT 
                        td.ticket_id
                    FROM 
                        tbl_ticket_details td
                    WHERE 
                        td.action_by = ${db.escape(userId)} OR td.action_to = ${db.escape(userId)}
                )
                AND
                t.id IN (
                    SELECT 
                        td.ticket_id
                    FROM 
                        tbl_ticket_details td
                    WHERE
                        td.action_by_department_id = ${db.escape(userDeptId)} OR td.action_to_department_id = ${db.escape(userDeptId)}
                )
                AND t.is_deleted = '0'
            ORDER BY 
                t.updated_at DESC`
            db.query(sql, (err, ticketList) => {
                if(err) {
                    next(err)
                }
                else {
                    res.json({status: "success", message: "Raised by or assigned to my department (not me) ticket list", data: ticketList})
                }
            })
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    getSiteGeneratedAllOther: (req, res, next) => {
        if("1" == global.user_info[0].can_track_site_tickets) {
            const userId = global.user_info[0].id
            const sql = `
            SELECT
                t.id AS ticket_id, 
                t.ticket_number AS ticket_number, 
                t.ticket_title AS ticket_title, 
                t.ticket_priority AS ticket_priority, 
                t.ticket_status AS ticket_status, 
                t.created_at AS ticket_date,
                t.updated_at AS ticket_updated_on, 
                t.last_action AS ticket_action, 
                t.from_site_id AS ticket_raise_from_site_id,
                s.site_name AS ticket_raise_from_site_name,
                t.to_department_id AS ticket_raise_to_dept_id, 
                d.department_name AS ticket_raise_to_dept_name,
                t.raised_by AS ticket_raise_by_id, 
                us.user_name AS ticket_raise_by_name
            FROM 
                tbl_tickets t
            JOIN 
                tbl_departments d ON t.to_department_id = d.id
            JOIN
                tbl_sites s ON t.from_site_id = s.id
            JOIN
                tbl_users us ON t.raised_by = us.id
            JOIN 
                tbl_user_site_mapping usm ON t.from_site_id = usm.site_id
            WHERE 
                usm.user_id = ${db.escape(userId)}
                AND t.raised_by != ${db.escape(userId)}
                AND t.is_deleted = '0'
            ORDER BY 
                t.updated_at DESC`
            db.query(sql, (err, ticketList) => {
                if(err) {
                    next(err)
                }
                else {
                    res.json({status: "success", message: "Raised from all my sites (but not me) ticket list", data: ticketList})
                }
            })
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    getTicketDetails: (req, res, next) => {
        const ticketId = req.params.ticket_id
        if(ticketId > 0) {
            const sql = `
            SELECT 
                td.ticket_comment AS ticket_comment, 
                td.ticket_action AS ticket_action, 
                u.user_name AS action_by_user_name, 
                d.department_name AS action_by_department_name,
                us.user_name AS action_to_user_name,
                dt.department_name AS action_to_department_name,
                td.action_date, 
                GROUP_CONCAT(DISTINCT CONCAT(ta.id, '|~|', ta.uploaded_file_original_name, '|~|', ta.uploaded_file_name) SEPARATOR ', ') AS uploaded_file_details
            FROM 
                tbl_ticket_details td
            JOIN 
                tbl_users u ON td.action_by = u.id
            LEFT JOIN
                tbl_departments d ON u.department_id = d.id
            JOIN
                tbl_users us ON td.action_to = us.id
            JOIN
                tbl_departments dt ON us.department_id = dt.id
            LEFT JOIN 
                tbl_ticket_attachments ta ON td.id = ta.ticket_details_id
            WHERE 
                td.ticket_id = ${db.escape(ticketId)}
            GROUP BY 
                td.id, 
                td.ticket_comment, 
                td.ticket_action, 
                u.user_name, 
                d.department_name,
                td.action_date
            ORDER BY 
                td.action_date ASC, td.id ASC`

            db.query(sql, (err, ticketDetailsList) => {
                if(err) {
                    next(err)
                }
                else {
                    res.json({status: "success", message: "Ticket details list", data: ticketDetailsList})
                }
            })
        }
        else {
            res.json({status: "error", message: "Something went wrong"})
        }
    },

    update: (req, res, next) => {
        uploadFiles.array("issue_files", 5)(req, res, (err) => {
            if(err instanceof multer.MulterError) {
                removeUploadedFiles(req.files)
                next(err)
            }
            else if(err) {
                removeUploadedFiles(req.files)
                next(err)
            }
            else {
                const ticketId = req.params.ticket_id || 0
                const actionById = global.user_info[0].id
                const actionByName = global.user_info[0].user_name.trim()
                const actionByEmail = global.user_info[0].user_email.trim()
                const actionByDepartmentId = global.user_info[0].department_id
                const actionByRoleId = global.user_info[0].role_id
                const isAssignToUser = req.body.is_assign_to_user || 0
                const actionToId = req.body.current_assigner_id 
                const actionToName = req.body.current_assigner_name.trim() || ""
                const actionToEmail = req.body.current_assigner_email.trim() || ""
                const actionToDepartmentId = req.body.current_assigner_department_id || 0
                const actionToDepartmentName = req.body.current_assigner_department_name.trim() || ""
                const actionToRoleId = req.body.current_assigner_role_id || 0
                const ticketAction = req.body.ticket_action.trim() || ""
                const ticketComment = req.body.ticket_comment.trim() || ""
                if(ticketId > 0 && (isAssignToUser == 0 || isAssignToUser == 1) && actionToId > 0 && actionToName !== "" && actionToEmail !== "" && actionToDepartmentId > 0 && actionToDepartmentName !== "" && actionToRoleId > 0) {
                    if(ticketAction !== "" && ticketComment !== "") {
                        const sql = `
                        INSERT INTO
                            tbl_ticket_details
                        SET
                            ticket_id=${db.escape(ticketId)},
                            ticket_comment=${db.escape(ticketComment)},
                            ticket_action=${db.escape(ticketAction)},
                            action_by=${db.escape(actionById)},
                            action_by_role_id=${db.escape(actionByRoleId)},
                            action_by_department_id=${db.escape(actionByDepartmentId)},
                            action_to=${db.escape(actionToId)},
                            action_to_role_id=${db.escape(actionToRoleId)},
                            action_to_department_id=${db.escape(actionToDepartmentId)}`
                        db.query(sql, (err, ticketDetailsInfo) => {
                            if(err) {
                                removeUploadedFiles(req.files)
                                next(err)
                            }
                            else {
                                const ticketDetailsIdCreated = ticketDetailsInfo.insertId
                                if(req.files.length > 0) {
                                    const fileDetails = req.files.map((file) => [
                                        ticketDetailsIdCreated,
                                        file.filename,
                                        file.mimetype,
                                        actionById,
                                        file.originalname
                                    ])
                                    const attachmentSql = `INSERT INTO tbl_ticket_attachments (ticket_details_id, uploaded_file_name, uploaded_file_type, uploaded_by, uploaded_file_original_name) VALUES ?`
                                    db.query(attachmentSql, [fileDetails], (err, ticketAttachmentInfo) => {
                                        if(err) {
                                            removeUploadedFiles(req.files)
                                            db.execute("DELETE FROM tbl_ticket_details WHERE id="+db.escape(ticketDetailsIdCreated))
                                            next(err)
                                        }
                                        else {
                                            updateTicket(req, res, next, ticketDetailsIdCreated)
                                        }
                                    })
                                }
                                else {
                                    updateTicket(req, res, next, ticketDetailsIdCreated)
                                }
                            }
                        })
                    }
                    else {
                        removeUploadedFiles(req.files)
                        res.json({status: "error", message: "Mandetory field error"})
                    }
                }
                else {
                    removeUploadedFiles(req.files)
                    res.json({status: "error", message: "Something went wrong"})
                }
            }
        })
    },

    updateUnsolved: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            const ticketId = req.params.ticket_id || 0
            const actionById = global.user_info[0].id
            const actionByRoleId = global.user_info[0].role_id
            const actionByDepartmentId = global.user_info[0].department_id
            const actionToId = req.body.current_assigner_id || 0
            const actionToRoleId = req.body.current_assigner_role_id || 0
            const actionToDepartmentId = req.body.current_assigner_department_id || 0
            const ticketAction = "Unsolved"
            const ticketComment = req.body.ticket_comment.trim() || ""
            const raiseByName = req.body.ticket_raise_by_name.trim()
            const raiseByEmail = req.body.ticket_raise_by_email.trim()
            const ticketNumber = req.body.ticket_number.trim()
            const ticketTitle = req.body.ticket_title.trim() || ""
            if(ticketId > 0 && actionToId > 0 && actionToRoleId > 0 && actionToDepartmentId > 0) {
                if(ticketComment !== "") {
                    const sql = `
                    INSERT INTO
                        tbl_ticket_details
                    SET
                        ticket_id=${db.escape(ticketId)},
                        ticket_comment=${db.escape(ticketComment)},
                        ticket_action=${db.escape(ticketAction)},
                        action_by=${db.escape(actionById)},
                        action_by_role_id=${db.escape(actionByRoleId)},
                        action_by_department_id=${db.escape(actionByDepartmentId)},
                        action_to=${db.escape(actionToId)},
                        action_to_role_id=${db.escape(actionToRoleId)},
                        action_to_department_id=${db.escape(actionToDepartmentId)}`
                    db.query(sql, (err, ticketDetailsInfo) => {
                        if(err) {
                            next(err)
                        }
                        else {
                            const ticketDetailsIdCreated = ticketDetailsInfo.insertId
                            const ticketStatus = "Unsolve"
                            updateSql = `
                            UPDATE 
                                tbl_tickets
                            SET
                                ticket_status=${db.escape(ticketStatus)},
                                last_action=${db.escape(ticketAction)}
                            WHERE
                                id=${db.escape(ticketId)}`
                            db.query(updateSql, (err, ticketUpdateInfo) => {
                                if(err) {
                                    db.execute("DELETE FROM tbl_ticket_details WHERE id="+db.escape(ticketDetailsIdCreated))
                                    next(err)
                                }
                                else {
                                    const toMailId = raiseByEmail
                                    const recipientName = raiseByName
                                    const ccMailId = null
                                    const printableBody = `<p>This mail is to notify you that the following ticket has ${ticketAction}:</p>`
                                    const mailSubject = `Ticket no. ${ticketNumber} - ${ticketAction}`
                                    const mailBody = `
                                    <!DOCTYPE html>
                                    <html>
                                        <head>
                                            <meta charset="UTF-8">
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                            <style>
                                                body {
                                                    font-family: Arial, sans-serif;
                                                    margin: 0;
                                                    padding: 0;
                                                    background-color: #f4f4f4;
                                                }
                                                .email-container {
                                                    max-width: 600px;
                                                    margin: 20px auto;
                                                    background-color: #ffffff;
                                                    border: 1px solid #dddddd;
                                                    border-radius: 5px;
                                                    overflow: hidden;
                                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                                                }
                                                .email-header {
                                                    background-color: #4CAF50;
                                                    color: #ffffff;
                                                    text-align: center;
                                                    padding: 15px;
                                                }
                                                .email-header h1 {
                                                    margin: 0;
                                                    font-size: 20px;
                                                }
                                                .email-body {
                                                    padding: 0px;
                                                    color: #333333;
                                                    line-height: 1.6;
                                                    margin: 10px;
                                                }
                                                .email-body h2 {
                                                    margin: 0 0 10px;
                                                    font-size: 18px;
                                                }
                                                .email-footer {
                                                    background-color: #f9f9f9;
                                                    text-align: center;
                                                    padding: 10px;
                                                    font-size: 12px;
                                                    color: #777777;
                                                }
                                                a {
                                                    color: #4CAF50;
                                                    text-decoration: none;
                                                }
                                                .button {
                                                    display: inline-block;
                                                    background-color: #4CAF50;
                                                    color: #ffffff;
                                                    text-decoration: none;
                                                    padding: 10px 20px;
                                                    border-radius: 3px;
                                                    font-size: 14px;
                                                }
                                                .button:hover {
                                                    background-color: #45a049;
                                                }
                                                @media only screen and (max-width: 600px) {
                                                    .email-body, .email-header, .email-footer {
                                                        padding: 15px;
                                                        margin: 20px auto;
                                                    }

                                                    .button {
                                                        font-size: 12px;
                                                        padding: 8px 16px;
                                                    }
                                                }
                                            </style>
                                        </head>
                                        <body>
                                            <div class="email-container">
                                                <div class="email-header">
                                                    <h1>Update Ticket Notification</h1>
                                                </div>
                                                <div class="email-body">
                                                    <h2>Hello ${recipientName},</h2>
                                                    ${printableBody}
                                                    <p><strong>Ticket Title:</strong> ${ticketTitle}</p>
                                                    <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
                                                    <p>You can view more details and manage this ticket by visiting the Ticket Raise System using the link below:</p>
                                                    <p style="text-align: center;"><a href="${config.FRONTEND_URL}/dashboard" class="button">Click Here</a></p>
                                                    <p>Best regards,<br/>DRIL - Ticket Raise System</p>
                                                </div>
                                                <div class="email-footer">
                                                    <p>This is an automated email. Please do not reply to this email.</p>
                                                    <p>&copy; Esteem Infrastructure Pvt Ltd. All rights reserved.</p>
                                                </div>
                                            </div>
                                        </body>
                                    </html>`
                                    sendEmail(toMailId, ccMailId, mailSubject, mailBody)
                                    res.json({status: "success", message: "Ticket successfully updated"})
                                }
                            })
                        }
                    })
                }
                else {
                    res.json({status: "error", message: "Mandetory field error"})
                }
            }
            else {
                res.json({status: "error", message: "Something went wrong"})
            }
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    }
}