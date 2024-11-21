const db = require("../../../config/db")

module.exports = {
    getAll: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            if("roles" == req.params.role_type || "activeRoles" == req.params.role_type) {
                let sql = ""
                switch(req.params.role_type) {
                    case "roles":       sql = "SELECT id AS role_id, role_name AS role_name, is_active AS is_active FROM tbl_roles WHERE is_deleted='0'"
                                        break

                    case "activeRoles": sql = "SELECT id AS role_id, role_name AS role_name FROM tbl_roles WHERE is_active='1' AND is_deleted='0'"
                                        break
                }
                db.query(sql, (err, role_list) => {
                    if(err) {
                        next(err)
                    }
                    else {
                        res.json({status: "success", message: "Role list", data: role_list})
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
            let roleName = req.body.role_name.trim()
            if(roleName !== "") {
                db.query("SELECT COUNT(*) AS role_count FROM tbl_roles WHERE role_name="+db.escape(roleName)+" AND is_deleted='0'", (err, isExist) => {
                    if(err) {
                        next(err)
                    }
                    else if(isExist[0].role_count > 0) {
                        res.json({status: "error", message: "Role already exist"})
                    }
                    else {
                        db.query("INSERT INTO tbl_roles SET role_name="+db.escape(roleName), (err, roleInfo) => {
                            if(err) {
                                next(err)
                            }
                            else if(roleInfo.insertId > 0) {
                                res.json({status: "success", message: "Role successfully created"})
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
            let roleId = req.params.role_id
            let roleName = req.body.role_name.trim()
            let roleIsActive = req.body.role_is_active
            if(roleId > 0) {
                if(roleName !== "" && (roleIsActive == 0 || roleIsActive == 1)) {
                    db.query("SELECT COUNT(*) AS role_count FROM tbl_roles WHERE id!="+db.escape(roleId)+" AND role_name="+db.escape(roleName)+" AND is_deleted='0'", (err, isExist) => {
                        if(err) {
                            next(err)
                        }
                        else if(isExist[0].role_count > 0) {
                            res.json({status: "error", message: "Role already exist"})
                        }
                        else {
                            db.query("UPDATE tbl_roles SET role_name="+db.escape(roleName)+", is_active="+db.escape(roleIsActive)+" WHERE id="+db.escape(roleId), (err, roleInfo) => {
                                if(err) {
                                    next(err)
                                }
                                else if(roleInfo.affectedRows === 1) {
                                    res.json({status: "success", message: "Role successfully updated"})
                                }
                                else {
                                    res.json({status: "error", message: "Something went wrong. Role not updated"})
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
            let roleId = req.params.role_id
            if(roleId > 0) {
                db.query("UPDATE tbl_roles SET is_deleted='1' WHERE id="+db.escape(roleId), (err, roleInfo) => {
                    if(err) {
                        next(err)
                    }
                    else if(roleInfo.affectedRows === 1) {
                        res.json({status: "success", message: "Role successfully deleted"})
                    }
                    else {
                        res.json({status: "error", message: "Something went wrong. Role not deleted"})
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
    }
}