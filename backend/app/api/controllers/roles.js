const pool = require("../../../config/database")

module.exports = {
    getAll: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            pool.getConnection((err, connection) => {
                if(err) {
                    next(err)
                }
                connection.query("SELECT id AS role_id, role_name AS role_name, is_active AS is_active FROM tbl_roles WHERE is_deleted='0'", (err, role_list) => {
                    connection.release()
                    if(err) {
                        next(err)
                    }
                    res.json({status:'success', message:'Role list', data:role_list})
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
                connection.query("SELECT COUNT(*) AS role_count FROM tbl_roles WHERE role_name="+connection.escape(req.body.role_name)+" AND is_deleted='0'", (err, isExist) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else if(isExist[0].role_count) {
                        connection.release()
                        res.json({status:'error', message:'Role already exist'})
                    }
                    else {
                        connection.query("INSERT INTO tbl_roles SET role_name="+connection.escape(req.body.role_name), (err, roleInfo) => {
                            connection.release()
                            if(err) {
                                next(err)
                            }
                            res.json({status:'success', message:'Role successfully created'})
                        })
                    }
                })
            })
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
                connection.query("SELECT COUNT(*) AS role_count FROM tbl_roles WHERE id!="+connection.escape(req.params.role_id)+" AND role_name="+connection.escape(req.body.role_name)+" AND is_deleted='0'", (err, isExist) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else if(isExist[0].role_count) {
                        connection.release()
                        res.json({status:"error", message:"Role already exist"})
                    }
                    else {
                        connection.query("UPDATE tbl_roles SET role_name="+connection.escape(req.body.role_name)+", is_active="+connection.escape(req.body.role_is_active)+" WHERE id="+connection.escape(req.params.role_id), (err, roleInfo) => {
                            connection.release()
                            if(err) {
                                next(err)
                            }
                            res.json({status:"success", message:"Role successfully updated"})
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
                    next(err)
                }
                connection.query("UPDATE tbl_roles SET is_deleted='1' WHERE id="+connection.escape(req.params.role_id), (err, roleInfo) => {
                    connection.release()
                    if(err) {
                        next(err)
                    }
                    res.json({status:"success", message:"Role successfully deleted"})
                })
            })
        }
        else {
            res.json({status:"error", message:"Permission denied"})
        }
    }
}