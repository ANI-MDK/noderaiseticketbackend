const pool      = require("../../../config/database")
const bcrypt    = require('bcrypt')
const config    = require("../../../config/config")

module.exports = {
    getAll: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            pool.getConnection((err, connection) => {
                if(err) {
                    connection.release()
                    next(err)
                }
                connection.query("SELECT u.id AS user_id, u.user_name, u.user_email, u.department_id AS user_department_id, d.department_name AS user_department_name, u.role_id AS user_role_id, r.role_name AS user_role_name, u.is_login AS is_login, u.is_active AS is_active, GROUP_CONCAT(DISTINCT s.id SEPARATOR ', ') AS user_site_ids, GROUP_CONCAT(DISTINCT s.site_name SEPARATOR ', ') AS user_site_names, GROUP_CONCAT(DISTINCT CONCAT(s.id, ' - ', s.site_name) SEPARATOR ', ') AS user_sites FROM tbl_users u LEFT JOIN tbl_departments d ON u.department_id = d.id LEFT JOIN tbl_roles r ON u.role_id = r.id LEFT JOIN tbl_user_site_mapping usm ON u.id = usm.user_id LEFT JOIN tbl_sites s ON usm.site_id = s.id WHERE u.is_admin_user='0' AND u.is_deleted='0' GROUP BY u.id, u.user_name, u.user_email, u.department_id, d.department_name, u.role_id, r.role_name, u.is_login, u.is_active", (err, user_list) => {
                    connection.release()
                    if(err) {
                        next(err)
                    }
                    res.json({status:"success", message:"User list", data:user_list})
                })
            })
        }
        else {
            res.json({status:"error", message:"Permission denied"})
        }
    },

    getDepartmentWiseActiveUser: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            if(req.params.department_id > 0) {
                pool.getConnection((err, connection) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else {
                        connection.query("SELECT id AS user_id, user_name AS user_name, user_email AS user_email FROM tbl_users WHERE department_id="+connection.escape(req.params.department_id)+" AND is_active='1' AND is_deleted='0'", (err, user_list) => {
                            connection.release()
                            if(err) {
                                next(err)
                            }
                            res.json({status:"success", message:"Department wise user list", data:user_list})
                        })
                    }
                })
            }
            else {
                res.json({status:"error", message:"Mandetory field error"})
            }
        }
        else {
            res.json({status:"error", message:"Permission denied"})
        }
    },

    create: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            pool.getConnection((err, connection) => {
                if(err) {
                    connection.release()
                    next(err)
                }
                connection.query("SELECT COUNT(*) AS user_count FROM tbl_users WHERE user_email="+connection.escape(req.body.user_email)+" AND is_deleted='0'", (err, isExist) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else if(isExist[0].user_count) {
                        connection.release()
                        res.json({status:"error", message:"User already exist"})
                    }
                    else if(req.body.user_name != "" && req.body.user_email != "" && req.body.user_password != "" && req.body.department_id > 0 && req.body.role_id > 0 && Array.isArray(req.body.associated_sites) && req.body.associated_sites.length > 0) {
                        connection.query("INSERT INTO tbl_users SET user_name="+connection.escape(req.body.user_name)+", user_email="+connection.escape(req.body.user_email)+", user_password="+connection.escape(bcrypt.hashSync(req.body.user_password, Number(config.SALT_ROUND)))+", department_id="+connection.escape(req.body.department_id)+", role_id="+connection.escape(req.body.role_id), (err, userInfo) => {
                            if(err) {
                                connection.release()
                                next(err)
                            }
                            else if(userInfo.insertId) {
                                const associated_sites = req.body.associated_sites
                                const values = associated_sites.map((site) => [userInfo.insertId, site])
                                connection.query("INSERT INTO tbl_user_site_mapping (user_id, site_id) VALUES ?", [values], (err, siteUserMappingInfo) => {
                                    if(err) {
                                        connection.release()
                                        next(err)
                                    }
                                    else if(siteUserMappingInfo.insertId) {
                                        connection.release()
                                        res.json({status:"success", message:"User successfully created"})
                                    }
                                    else {
                                        connection.query("DELETE FROM tbl_users WHERE id="+connection.escape(userInfo.insertId), (err, delInfo) => {
                                            connection.release()
                                            if(err) {
                                                next(err)
                                            }
                                            res.json({status:"error", message:"Something went wrong"})
                                        })
                                    }
                                })
                            }
                            else {
                                res.json({status:"error", message:"User not created"})
                            }
                        })
                    }
                    else {
                        res.json({status:"error", message:"Mandetory field error"})
                    }
                })
            })
        }
        else {
            res.json({status:"error", message:"Permission denied"})
        }
    },

    update: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            if(req.params.user_id > 0 && req.body.user_name != "" && req.body.user_email != "" && (req.body.user_is_active == "0" || req.body.user_is_active == "1") && req.body.department_id > 0 && req.body.role_id > 0 && Array.isArray(req.body.associated_sites) && req.body.associated_sites.length > 0) {
                pool.getConnection((err, connection) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else {
                        connection.query("SELECT COUNT(*) AS user_count FROM tbl_users WHERE id!="+connection.escape(req.params.user_id)+" AND user_email="+connection.escape(req.body.user_email)+" AND is_deleted='0'", (err, isExist) => {
                            if(err) {
                                connection.release()
                                next(err)
                            }
                            else if(isExist[0].user_count) {
                                connection.release()
                                res.json({status:"error", message:"User already exist"})
                            }
                            else {
                                connection.query("UPDATE tbl_users SET user_name="+connection.escape(req.body.user_name)+", user_email="+connection.escape(req.body.user_email)+", department_id="+connection.escape(req.body.department_id)+", role_id="+connection.escape(req.body.role_id)+", is_active="+connection.escape(req.body.user_is_active)+" WHERE id="+connection.escape(req.params.user_id), (err, userInfo) => {
                                    if(err) {
                                        connection.release()
                                        next(err)
                                    }
                                    else if(userInfo.affectedRows) {
                                        connection.query("DELETE FROM tbl_user_site_mapping WHERE user_id="+connection.escape(req.params.user_id), (err, delInfo) => {
                                            if(err) {
                                                connection.release()
                                                next(err)
                                            }
                                            else {
                                                const associated_sites = req.body.associated_sites
                                                const values = associated_sites.map((site) => [req.params.user_id, site])
                                                connection.query("INSERT INTO tbl_user_site_mapping (user_id, site_id) VALUES ?", [values], (err, siteUserMappingInfo) => {
                                                    if(err) {
                                                        connection.release()
                                                        next(err)
                                                    }
                                                    else {
                                                        connection.release()
                                                        res.json({status:"success", message:"User successfully updated"})
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    else {
                                        connection.release()
                                        res.json({status:"error", message:"User not updated"})
                                    }
                                })
                            }
                        })
                    }
                })
            }
            else {
                res.json({status:"error", message:"Mandetory field error"})
            }
        }
        else {
            res.json({status:"error", message:"Permission denied"})
        }
    },

    updatePassword: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            if(req.params.user_id > 0 && req.body.user_password != "") {
                pool.getConnection((err, connection) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else {
                        connection.query("UPDATE tbl_users SET user_password="+connection.escape(bcrypt.hashSync(req.body.user_password, Number(config.SALT_ROUND)))+" WHERE id="+connection.escape(req.params.user_id), (err, userInfo) => {
                            if(err) {
                                connection.release()
                                next(err)
                            }
                            else if(userInfo.affectedRows) {
                                connection.release()
                                res.json({status:"success", message:"Password successfully updated"})
                            }
                            else {
                                connection.release()
                                res.json({status:"error", message:"Password not updated"})
                            }
                        })
                    }
                })
            }
            else {
                res.json({status:"error", message:"Mandetory field error"})
            }
        }
        else {
            res.json({status:"error", message:"Permission denied"})
        }
    },

    delete: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            pool.getConnection((err, connection) => {
                if(err) {
                    connection.release()
                    next(err)
                }
                else if(req.params.user_id) {
                    connection.query("UPDATE tbl_users SET is_deleted='1' WHERE id="+connection.escape(req.params.user_id), (err, userInfo) => {
                        connection.release()
                        if(err) {
                            next(err)
                        }
                        else if(userInfo.affectedRows) {
                            res.json({status:"success", message:"User successfully deleted"})
                        }
                        else {
                            res.json({status:'error', message:'User not deleted'})
                        }
                    })
                }
                else {
                    connection.release()
                    res.json({status:"error", message:"Something went wrong"})
                }
            })
        }
        else {
            res.json({status:"error", message:"Permission denied"})
        }
    }
}