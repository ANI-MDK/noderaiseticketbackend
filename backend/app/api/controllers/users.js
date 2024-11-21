const db        = require("../../../config/db")
const bcrypt    = require("bcrypt")
const config    = require("../../../config/config")

module.exports = {
    getAll: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            db.query("SELECT u.id AS user_id, u.user_name, u.user_email, u.department_id AS user_department_id, d.department_name AS user_department_name, u.role_id AS user_role_id, r.role_name AS user_role_name, u.is_login AS is_login, u.is_active AS is_active, GROUP_CONCAT(DISTINCT s.id SEPARATOR ', ') AS user_site_ids, GROUP_CONCAT(DISTINCT s.site_name SEPARATOR ', ') AS user_site_names, GROUP_CONCAT(DISTINCT CONCAT(s.id, ' - ', s.site_name) SEPARATOR ', ') AS user_sites FROM tbl_users u LEFT JOIN tbl_departments d ON u.department_id = d.id AND d.is_active='1' AND d.is_deleted='0' LEFT JOIN tbl_roles r ON u.role_id = r.id AND r.is_active='1' AND r.is_deleted='0' LEFT JOIN tbl_user_site_mapping usm ON u.id = usm.user_id LEFT JOIN tbl_sites s ON usm.site_id = s.id AND s.is_active='1' AND s.is_deleted='0' WHERE u.is_admin_user='0' AND u.is_deleted='0' GROUP BY u.id, u.user_name, u.user_email, u.department_id, d.department_name, u.role_id, r.role_name, u.is_login, u.is_active", (err, user_list) => {
                if(err) {
                    next(err)
                }
                else {
                    res.json({status: "success", message: "User list", data: user_list})
                }
            })
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    getDepartmentWiseActiveUser: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            let departmentId = req.params.department_id
            if(departmentId > 0) {
                db.query("SELECT id AS user_id, user_name AS user_name, user_email AS user_email FROM tbl_users WHERE department_id="+db.escape(departmentId)+" AND is_active='1' AND is_deleted='0'", (err, user_list) => {
                    if(err) {
                        next(err)
                    }
                    else {
                        res.json({status: "success", message: "Department wise user list", data: user_list})
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
            let userName = req.body.user_name.trim()
            let userEmail = req.body.user_email.trim()
            let userPassword = req.body.user_password.trim()
            let departmentId = req.body.department_id
            let roleId = req.body.role_id
            let associatedSites = req.body.associated_sites
            if(userName !== "" && userEmail !== "" && userPassword !== "" && departmentId > 0 && roleId > 0 && Array.isArray(associatedSites) && associatedSites.length > 0) {
                db.query("SELECT COUNT(*) AS user_count FROM tbl_users WHERE user_email="+db.escape(userEmail)+" AND is_deleted='0'", (err, isExist) => {
                    if(err) {
                        next(err)
                    }
                    else if(isExist[0].user_count) {
                        res.json({status: "error", message: "User already exist"})
                    }
                    else {
                        db.query("INSERT INTO tbl_users SET user_name="+db.escape(userName)+", user_email="+db.escape(userEmail)+", user_password="+db.escape(bcrypt.hashSync(userPassword, Number(config.SALT_ROUND)))+", department_id="+db.escape(departmentId)+", role_id="+db.escape(roleId), (err, userInfo) => {
                            if(err) {
                                next(err)
                            }
                            else if(userInfo.insertId > 0) {
                                const lastInsertId = userInfo.insertId
                                const values = associatedSites.map((site) => [lastInsertId, site])
                                db.query("INSERT INTO tbl_user_site_mapping (user_id, site_id) VALUES ?", [values], (err, siteUserMappingInfo) => {
                                    if(err) {
                                        next(err)
                                    }
                                    else if(siteUserMappingInfo.insertId > 0) {
                                        res.json({status: "success", message: "User successfully created"})
                                    }
                                    else {
                                        db.query("DELETE FROM tbl_users WHERE id="+db.escape(lastInsertId), (err, delInfo) => {
                                            if(err) {
                                                next(err)
                                            }
                                            else {
                                                res.json({status: "error", message: "Something went wrong"})
                                            }
                                        })
                                    }
                                })
                            }
                            else {
                                res.json({status: "error", message: "Something went wrong. User not created"})
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
            let userId = req.params.user_id
            let userName = req.body.user_name.trim()
            let userEmail = req.body.user_email.trim()
            let userIsActive = req.body.user_is_active
            let departmentId = req.body.department_id
            let roleId = req.body.role_id
            let associatedSites = req.body.associated_sites
            if(userId > 0) {
                if(userName !== "" && userEmail !== "" && (userIsActive == "0" || userIsActive == "1") && departmentId > 0 && roleId > 0 && Array.isArray(associatedSites) && associatedSites.length > 0) {
                    db.query("SELECT COUNT(*) AS user_count FROM tbl_users WHERE id!="+db.escape(userId)+" AND user_email="+db.escape(userEmail)+" AND is_deleted='0'", (err, isExist) => {
                        if(err) {
                            next(err)
                        }
                        else if(isExist[0].user_count > 0) {
                            res.json({status: "error", message: "User already exist"})
                        }
                        else {
                            db.query("UPDATE tbl_users SET user_name="+db.escape(userName)+", user_email="+db.escape(userEmail)+", department_id="+db.escape(departmentId)+", role_id="+db.escape(roleId)+", is_active="+db.escape(userIsActive)+" WHERE id="+db.escape(userId), (err, userInfo) => {
                                if(err) {
                                    next(err)
                                }
                                else if(userInfo.affectedRows === 1) {
                                    db.query("DELETE FROM tbl_user_site_mapping WHERE user_id="+db.escape(userId), (err, delInfo) => {
                                        if(err) {
                                            next(err)
                                        }
                                        else if(delInfo.affectedRows > 0) {
                                            const values = associatedSites.map((site) => [userId, site])
                                            db.query("INSERT INTO tbl_user_site_mapping (user_id, site_id) VALUES ?", [values], (err, siteUserMappingInfo) => {
                                                if(err) {
                                                    next(err)
                                                }
                                                else {
                                                    res.json({status: "success", message: "User successfully updated"})
                                                }
                                            })
                                        }
                                        else {
                                            res.json({status: "error", message: "User updated successfully but associated sites not updated"})
                                        }
                                    })
                                }
                                else {
                                    res.json({status: "error", message: "Something went wrong. User not updated"})
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

    updatePassword: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            let userId = req.params.user_id
            if(userId > 0) {
                let userNewPassword = req.body.user_password.trim()
                if(userNewPassword !== "") {
                    db.query("UPDATE tbl_users SET user_password="+db.escape(bcrypt.hashSync(userNewPassword, Number(config.SALT_ROUND)))+" WHERE id="+db.escape(userId), (err, userInfo) => {
                        if(err) {
                            next(err)
                        }
                        else if(userInfo.affectedRows === 1) {
                            res.json({status: "success", message: "Password successfully updated"})
                        }
                        else {
                            res.json({status: "error", message: "Something went wrong. Password not updated"})
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
            let userId = req.params.user_id
            if(userId > 0) {
                db.query("UPDATE tbl_users SET is_deleted='1' WHERE id="+db.escape(userId), (err, userInfo) => {
                    if(err) {
                        next(err)
                    }
                    else if(userInfo.affectedRows === 1) {
                        res.json({status: "success", message: "User successfully deleted"})
                    }
                    else {
                        res.json({status: "error", message: "Something went wrong. User not deleted"})
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