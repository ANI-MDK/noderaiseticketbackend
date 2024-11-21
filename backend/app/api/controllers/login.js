const db        = require("../../../config/db")
const bcrypt    = require("bcrypt")
const jwt       = require("jsonwebtoken")
const config    = require("../../../config/config")

module.exports = {
    authenticate: (req, res, next) => {
        db.query("SELECT u.id as user_id, u.user_name as user_name, u.user_email as user_email, u.user_password as user_password, u.is_admin_user as is_admin_user, u.can_raise_new_ticket as user_can_raise_new_ticket, u.can_track_all_tickets as user_can_track_all_tickets, u.can_assign_ticket as user_can_assign_ticket, d.department_name as user_department_name, r.role_name as user_role_name FROM tbl_users u LEFT JOIN tbl_departments d ON u.department_id=d.id AND d.is_active='1' AND d.is_deleted='0' LEFT JOIN tbl_roles r ON u.role_id=r.id AND r.is_active='1' AND r.is_deleted='0' WHERE u.user_email="+db.escape(req.body.username)+" AND u.is_active='1' AND u.is_deleted='0'", (err, userInfo) => {
            if(err) {
                next(err)
            }
            else if(userInfo.length) {
                userInfo = userInfo[0]
                if("1" != userInfo.is_admin_user && (null == userInfo.user_department_name || null == userInfo.user_role_name)) {
                    res.json({status: "error", message: "Invalid user or login unavailable"})
                }
                else if(bcrypt.compareSync(req.body.password, userInfo.user_password)) {
                    let sql = ""
                    if("1" != userInfo.is_admin_user) {
                        sql = "SELECT s.id AS site_id, s.site_name AS site_name FROM tbl_sites s INNER JOIN tbl_user_site_mapping m ON s.id=m.site_id WHERE m.user_id="+db.escape(userInfo.user_id)+" AND s.is_active='1' AND s.is_deleted='0'"
                    }
                    else {
                        sql = "SELECT id AS site_id, site_name FROM tbl_sites WHERE is_active='1' AND is_deleted='0'"
                    }

                    db.query(sql, (err, associatedSiteList) => {
                        if(err) {
                            next(err)
                        }
                        else if("1" != userInfo.is_admin_user && !associatedSiteList.length) {
                            res.json({status: "error", message: "login unavailable"})
                        }
                        else {
                            const accessToken = jwt.sign({ id: userInfo.user_id }, config.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: config.ACCESS_TOKEN_EXPIRES_IN })
                            res.header("Authorization", accessToken).json({
                                status: "success",
                                message: "Valid user",
                                data: {
                                    user_name: userInfo.user_name,
                                    user_email: userInfo.user_email,
                                    user_can_raise_new_ticket: userInfo.user_can_raise_new_ticket,
                                    user_can_track_all_tickets: userInfo.user_can_track_all_tickets,
                                    user_can_assign_ticket: userInfo.user_can_assign_ticket,
                                    is_admin_user: userInfo.is_admin_user,
                                    user_department_name: ("1" != userInfo.is_admin_user) ? userInfo.user_department_name : "Admin",
                                    user_role_name: ("1" != userInfo.is_admin_user) ? userInfo.user_role_name : "Admin",
                                    associatedSite: associatedSiteList
                                }
                            })
                        }
                    })
                }
                else {
                    res.json({status: "error", message: "Invalid user"})
                }
            }
            else {
                res.json({status: "error", message: "User not exist"})
            }
        })
    }
}