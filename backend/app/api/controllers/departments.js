const db = require("../../../config/db")

module.exports = {
    getAll: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            if("departments" == req.params.department_type || "activeDepartments" == req.params.department_type) {
                let sql = ""
                switch(req.params.department_type) {
                    case "departments":         sql = "SELECT d.id AS department_id, d.department_name AS department_name, d.is_active AS is_active, CASE WHEN u.is_active='1' AND u.is_deleted='0' THEN d.current_assigner_id ELSE '0' END AS current_assigner_id, CASE WHEN u.is_active='1' AND u.is_deleted='0' THEN u.user_name ELSE NULL END AS current_assigner_name FROM tbl_departments d LEFT JOIN tbl_users u ON d.current_assigner_id=u.id WHERE d.is_deleted='0'"
                                                break

                    case "activeDepartments":   sql = "SELECT d.id AS department_id, d.department_name AS department_name, CASE WHEN u.is_active='1' AND u.is_deleted='0' THEN d.current_assigner_id ELSE '0' END AS current_assigner_id, CASE WHEN u.is_active='1' AND u.is_deleted='0' THEN u.user_name ELSE NULL END AS current_assigner_name FROM tbl_departments d LEFT JOIN tbl_users u ON d.current_assigner_id=u.id WHERE d.is_active='1' AND d.is_deleted='0'"
                                                break
                }
                db.query(sql, (err, department_list) => {
                    if(err) {
                        next(err)
                    }
                    else {
                        res.json({status: "success", message: "Department list", data: department_list})
                    }
                })
            }
            else {
                res.json({status: "error", message: "Something went wrong"})
            }
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    create: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            let departmentName = req.body.department_name.trim()
            if(departmentName !== "") {
                db.query("SELECT COUNT(*) AS department_count FROM tbl_departments WHERE department_name="+db.escape(departmentName)+" AND is_deleted='0'", (err, isExist) => {
                    if(err) {
                        next(err)
                    }
                    else if(isExist[0].department_count) {
                        res.json({status: "error", message: "Department already exist"})
                    }
                    else {
                        db.query("INSERT INTO tbl_departments SET department_name="+db.escape(departmentName), (err, departmentInfo) => {
                            if(err) {
                                next(err)
                            }
                            else if(departmentInfo.insertId > 0) {
                                res.json({status: "success", message: "Department successfully created"})
                            }
                            else {
                                res.json({status: "error", message: "Something went wrong"})
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
            res.json({status: "error", message: "Permission denied"})
        }
    },

    update: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            let departmentId = req.params.department_id
            let departmentName = req.body.department_name.trim()
            let departmentIsActive = req.body.department_is_active
            if(departmentId > 0) {
                if(departmentName !== "" && (departmentIsActive == 0 || departmentIsActive == 1)) {
                    db.query("SELECT COUNT(*) AS department_count FROM tbl_departments WHERE id!="+db.escape(departmentId)+" AND department_name="+db.escape(departmentName)+" AND is_deleted='0'", (err, isExist) => {
                        if(err) {
                            next(err)
                        }
                        else if(isExist[0].department_count > 0) {
                            res.json({status: "error", message: "Department already exist"})
                        }
                        else {
                            db.query("UPDATE tbl_departments SET department_name="+db.escape(departmentName)+", is_active="+db.escape(departmentIsActive)+" WHERE id="+db.escape(departmentId), (err, departmentInfo) => {
                                if(err) {
                                    next(err)
                                }
                                else if(departmentInfo.affectedRows === 1) {
                                    res.json({status: "success", message: "Department successfully updated"})
                                }
                                else {
                                    res.json({status: "error", message: "Something went wrong. Department not updated"})
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
    },

    delete: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            let departmentId = req.params.department_id
            if(departmentId > 0) {
                db.query("UPDATE tbl_departments SET is_deleted='1' WHERE id="+db.escape(departmentId), (err, departmentInfo) => {
                    if(err) {
                        next(err)
                    }
                    else if(departmentInfo.affectedRows === 1) {
                        res.json({status: "success", message: "Department successfully deleted"})
                    }
                    else {
                        res.json({status: "error", message: "Something went wrong. Department not deleted"})
                    }
                })
            }
            else {
                res.json({status: "error", message: "Something went wrong"})
            }
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    updateDepartmentWiseAssigner: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            let departmentId = req.params.department_id
            let assignerId = req.body.assigner_id
            if(departmentId > 0) {
                if(assignerId > 0) {
                    db.query("UPDATE tbl_departments SET current_assigner_id="+db.escape(assignerId)+" WHERE id="+db.escape(departmentId), (err, departmentInfo) => {
                        if(err) {
                            next(err)
                        }
                        else if(departmentInfo.affectedRows === 1) {
                            res.json({status: "success", message: "User successfully assigned"})
                        }
                        else {
                            res.json({status: "error", message: "Something went wrong. User not assigned"})
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