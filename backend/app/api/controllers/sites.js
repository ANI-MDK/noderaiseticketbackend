const pool = require("../../../config/database")

module.exports = {
    getAll: (req, res, next) => {
        console.log("site list called")
        if(global.user_info[0].is_admin_user) {
            pool.getConnection((err, connection) => {
                console.log("db connected")
                if(err) {
                    next(err)
                }
                connection.query("SELECT id AS site_id, site_name AS site_name, is_active AS is_active FROM tbl_sites WHERE is_deleted='0'", (err, site_list) => {
                    console.log("query executed")
                    connection.release()
                    if(err) {
                        next(err)
                    }
                    res.json({status:'success', message:'Site list', data:site_list})
                    console.log("res send")
                })
            })
        }
        else {
            res.json({status:'error', message:'Permission denied'})
        }
    },

    create: (req, res, next) => {
        console.log("create site called")
        if(global.user_info[0].is_admin_user) {
            pool.getConnection((err, connection) => {
                if(err) {
                    next(err)
                }
                connection.query("SELECT COUNT(*) AS site_count FROM tbl_sites WHERE site_name="+connection.escape(req.body.site_name)+" AND is_deleted='0'", (err, isExist) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else if(isExist[0].site_count) {
                        connection.release()
                        res.json({status:'error', message:'Site already exist'})
                    }
                    else {
                        connection.query("INSERT INTO tbl_sites SET site_name="+connection.escape(req.body.site_name), (err, siteInfo) => {
                            connection.release()
                            if(err) {
                                next(err)
                            }
                            res.json({status:'success', message:'Site successfully created'})
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
        console.log("update site called")
        if(global.user_info[0].is_admin_user) {
            pool.getConnection((err, connection) => {
                if(err) {
                    next(err)
                }
                connection.query("SELECT COUNT(*) AS site_count FROM tbl_sites WHERE id!="+connection.escape(req.params.site_id)+" AND site_name="+connection.escape(req.body.site_name)+" AND is_deleted='0'", (err, isExist) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else if(isExist[0].site_count) {
                        connection.release()
                        res.json({status:"error", message:"Site already exist"})
                    }
                    else {
                        connection.query("UPDATE tbl_sites SET site_name="+connection.escape(req.body.site_name)+", is_active="+connection.escape(req.body.site_is_active)+" WHERE id="+connection.escape(req.params.site_id), (err, siteInfo) => {
                            connection.release()
                            if(err) {
                                next(err)
                            }
                            res.json({status:"success", message:"Site successfully updated"})
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
        console.log("delete site called")
        // console.log(req.params.site_id)
        if(global.user_info[0].is_admin_user) {
            pool.getConnection((err, connection) => {
                if(err) {
                    next(err)
                }
                // console.log("UPDATE tbl_sites SET is_deleted='1' WHERE id="+connection.escape(req.params.site_id))
                connection.query("UPDATE tbl_sites SET is_deleted='1' WHERE id="+connection.escape(req.params.site_id), (err, siteInfo) => {
                    connection.release()
                    if(err) {
                        next(err)
                    }
                    res.json({status:"success", message:"Site successfully deleted"})
                })
            })
        }
        else {
            res.json({status:"error", message:"Permission denied"})
        }
    }
}