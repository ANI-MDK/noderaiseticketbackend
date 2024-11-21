const db = require("../../../config/db")

module.exports = {
    getAll: (req, res, next) => {
        if(global.user_info[0].is_admin_user) {
            if("sites" == req.params.site_type || "activeSites" == req.params.site_type) {
                let sql = ""
                switch(req.params.site_type) {
                    case "sites":       sql = "SELECT id AS site_id, site_name AS site_name, is_active AS is_active FROM tbl_sites WHERE is_deleted='0'"
                                        break
    
                    case "activeSites": sql = "SELECT id AS site_id, site_name AS site_name FROM tbl_sites WHERE is_active='1' AND is_deleted='0'"
                                        break
                }
                db.query(sql, (err, site_list) => {
                    if(err) {
                        next(err)
                    }
                    else {
                        res.json({status: "success", message: "Site list", data: site_list})
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
            let siteName = req.body.site_name.trim()
            if(siteName !== "") {
                db.query("SELECT COUNT(*) AS site_count FROM tbl_sites WHERE site_name="+db.escape(siteName)+" AND is_deleted='0'", (err, isExist) => {
                    if(err) {
                        next(err)
                    }
                    else if(isExist[0].site_count > 0) {
                        res.json({status: "error", message: "Site already exist"})
                    }
                    else {
                        db.query("INSERT INTO tbl_sites SET site_name="+db.escape(siteName), (err, siteInfo) => {
                            if(err) {
                                next(err)
                            }
                            else if(siteInfo.insertId > 0) {
                                res.json({status: "success", message: "Site successfully created"})
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
            let siteId = req.params.site_id
            let siteName = req.body.site_name.trim()
            let siteIsActive = req.body.site_is_active
            if(siteId > 0) {
                if(siteName !== "" && (siteIsActive == 0 || siteIsActive == 1)) {
                    db.query("SELECT COUNT(*) AS site_count FROM tbl_sites WHERE id!="+db.escape(siteId)+" AND site_name="+db.escape(siteName)+" AND is_deleted='0'", (err, isExist) => {
                        if(err) {
                            next(err)
                        }
                        else if(isExist[0].site_count > 0) {
                            res.json({status: "error", message: "Site already exist"})
                        }
                        else {
                            db.query("UPDATE tbl_sites SET site_name="+db.escape(siteName)+", is_active="+db.escape(siteIsActive)+" WHERE id="+db.escape(siteId), (err, siteInfo) => {
                                if(err) {
                                    next(err)
                                }
                                else if(siteInfo.affectedRows === 1) {
                                    res.json({status: "success", message: "Site successfully updated"})
                                }
                                else {
                                    res.json({status: "error", message: "Something went wrong. Site not updated"})
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
            let siteId = req.params.site_id
            if(siteId > 0) {
                db.query("UPDATE tbl_sites SET is_deleted='1' WHERE id="+db.escape(siteId), (err, siteInfo) => {
                    if(err) {
                        next(err)
                    }
                    else if(siteInfo.affectedRows === 1) {
                        res.json({status: "success", message: "Site successfully deleted"})
                    }
                    else {
                        res.json({status: "error", message: "Something went wrong. Site not deleted"})
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