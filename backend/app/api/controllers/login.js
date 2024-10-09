const pool      = require("../../../config/database")
const config    = require("../../../config/config")
const bcrypt    = require('bcrypt')
const jwt       = require('jsonwebtoken')

module.exports = {
    authenticate: (req, res, next) => {
        // console.log("login auth called")
        pool.getConnection((err, connection) => {
            // console.log("db connected")
            if(err) {
                throw err
            }
            else {
                connection.query("SELECT u.id as user_id, u.user_name as user_name, u.user_email as user_email, u.user_password as user_password, u.is_admin_user as is_admin_user, u.can_raise_new_ticket as user_can_raise_new_ticket, u.can_track_all_tickets as user_can_track_all_tickets, u.can_assign_ticket as user_can_assign_ticket, d.department_name as user_department_name, r.role_name as user_role_name FROM tbl_users u LEFT JOIN tbl_departments d ON u.department_id=d.id LEFT JOIN tbl_roles r ON u.role_id=r.id WHERE u.user_email="+connection.escape(req.body.username)+" AND u.is_active='1' AND u.is_deleted='0'", (err, userInfo) => {
                    // console.log("query executed")
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else if(userInfo.length) {
                        // console.log("user found")
                        userInfo = userInfo[0]
                        if(bcrypt.compareSync(req.body.password, userInfo.user_password)) {
                            // console.log("password matched")
                            let associatedSiteList = []
                            if(!userInfo.is_admin_user) {
                                // console.log("Admin user")
                                connection.query("SELECT s.site_name as site_name FROM tbl_sites s INNER JOIN tbl_user_site_mapping m ON s.id=m.site_id AND m.user_id=? AND s.is_deleted=?", [userInfo.user_id, 0], (err, userSiteInfo) => {
                                    if(err) {
                                        next(err)
                                    }
                                    else {
                                        for(let site of userSiteInfo) {
                                            associatedSiteList.push({
                                                site_name: site.site_name
                                            })
                                        }
                                    }
                                })
                            }
                            connection.release()
                            const accessToken = jwt.sign({ id: userInfo.user_id }, config.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: config.ACCESS_TOKEN_EXPIRES_IN })
                            // console.log("token created")
                            res.header('Authorization', accessToken).json({
                                status: 'success',
                                message: 'Valid user',
                                data: {
                                    user_name: userInfo.user_name,
                                    user_email: userInfo.user_email,
                                    user_can_raise_new_ticket: userInfo.user_can_raise_new_ticket,
                                    user_can_track_all_tickets: userInfo.user_can_track_all_tickets,
                                    user_can_assign_ticket: userInfo.user_can_assign_ticket,
                                    is_admin_user: userInfo.is_admin_user,
                                    user_department_name: userInfo.user_department_name || "Admin",
                                    user_role_name: userInfo.user_role_name || "Admin",
                                    associatedSite: associatedSiteList
                                }
                            })
                        }
                        else {
                            // console.log("password mismatch")
                            connection.release()
                            res.json({status: 'error', message: 'Invalid user'})
                        }
                    }
                    else {
                        // console.log("no user found")
                        connection.release()
                        res.json({status: 'error', message: 'Invalid user'})
                    }
                    // console.log("send response")
                })
            }
        })
        // console.log("login executed")
    }
}