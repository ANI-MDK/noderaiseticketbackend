const pool = require("../../../config/database")

module.exports = {
    getAll: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            pool.getConnection((err, connection) => {
                if(err) {
                    next(err)
                }
                connection.query("SELECT d.id AS department_id, d.department_name AS department_name, d.is_active AS is_active, CASE WHEN u.is_active='1' AND u.is_deleted='0' THEN d.current_assigner_id ELSE '0' END AS current_assigner_id, CASE WHEN u.is_active='1' AND u.is_deleted='0' THEN u.user_name ELSE NULL END AS current_assigner_name FROM tbl_departments d LEFT JOIN tbl_users u ON d.current_assigner_id=u.id WHERE d.is_deleted='0'", (err, department_list) => {
                    connection.release()
                    if(err) {
                        next(err)
                    }
                    res.json({status:'success', message:'Department list', data:department_list})
                })
            })
        }
        else {
            res.json({status:'error', message:'Permission denied'})
        }
    },

    create: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            pool.getConnection((err, connection) => {
                if(err) {
                    next(err)
                }
                connection.query("SELECT COUNT(*) AS department_count FROM tbl_departments WHERE department_name="+connection.escape(req.body.department_name)+" AND is_deleted='0'", (err, isExist) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else if(isExist[0].department_count) {
                        connection.release()
                        res.json({status:'error', message:'Department already exist'})
                    }
                    else {
                        connection.query("INSERT INTO tbl_departments SET department_name="+connection.escape(req.body.department_name), (err, departmentInfo) => {
                            connection.release()
                            if(err) {
                                next(err)
                            }
                            if(departmentInfo.insertId) {
                                res.json({status:'success', message:'Department successfully created'})
                            }
                            else {
                                res.json({status:'error', message:'Department not created'})
                            }
                        })
                    }
                })
            })
        }
        else {
            res.json({status:'error', message:'Permission denied'})
        }
    },

    updateDepartmentWiseAssigner: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            if(req.params.department_id > 0 && req.body.assigner_id > 0) {
                pool.getConnection((err, connection) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else {
                        connection.query("UPDATE tbl_departments SET current_assigner_id="+connection.escape(req.body.assigner_id)+" WHERE id="+connection.escape(req.params.department_id), (err, departmentInfo) => {
                            connection.release()
                            if(err) {
                                next(err)
                            }
                            if(departmentInfo.affectedRows) {
                                res.json({status:"success", message:"User successfully assigned"})
                            }
                            else {
                                res.json({status:'error', message:'User not assigned'})
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
            res.json({status:'error', message:'Permission denied'})
        }
    },

    update: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            pool.getConnection((err, connection) => {
                if(err) {
                    next(err)
                }
                connection.query("SELECT COUNT(*) AS department_count FROM tbl_departments WHERE id!="+connection.escape(req.params.department_id)+" AND department_name="+connection.escape(req.body.department_name)+" AND is_deleted='0'", (err, isExist) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else if(isExist[0].department_count) {
                        connection.release()
                        res.json({status:"error", message:"Department already exist"})
                    }
                    else {
                        connection.query("UPDATE tbl_departments SET department_name="+connection.escape(req.body.department_name)+", is_active="+connection.escape(req.body.department_is_active)+" WHERE id="+connection.escape(req.params.department_id), (err, departmentInfo) => {
                            connection.release()
                            if(err) {
                                next(err)
                            }
                            if(departmentInfo.affectedRows) {
                                res.json({status:"success", message:"Department successfully updated"})
                            }
                            else {
                                res.json({status:'error', message:'Department not updated'})
                            }
                        })
                    }
                })
            })
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
                connection.query("UPDATE tbl_departments SET is_deleted='1' WHERE id="+connection.escape(req.params.department_id), (err, departmentInfo) => {
                    connection.release()
                    if(err) {
                        next(err)
                    }
                    else if(departmentInfo.affectedRows) {
                        res.json({status:"success", message:"Department successfully deleted"})
                    }
                    else {
                        res.json({status:'error', message:'Department not deleted'})
                    }
                })
            })
        }
        else {
            res.json({status:"error", message:"Permission denied"})
        }
    }
}