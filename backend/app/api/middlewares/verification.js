const jwt       = require('jsonwebtoken')
const config    = require("../../../config/config")
const pool      = require("../../../config/database")

module.exports = {
    tokenAuth: (req, res, next) => {
        console.log("token auth call started")
        const authHeader = req.headers.authorization
        if(authHeader) {
            try {
                const accessToken = authHeader.split(' ')[1]
                const accessTokenDecoded = jwt.verify(accessToken, config.ACCESS_TOKEN_PRIVATE_KEY)
                pool.getConnection((err, connection) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else {
                        connection.query("SELECT * FROM tbl_users WHERE id="+connection.escape(accessTokenDecoded.id)+" AND is_active='1' AND is_deleted='0'", (err, userInfo) => {
                            connection.release()
                            if(err) {
                                next(err)
                            }
                            global.user_info = userInfo
                            next()
                        })
                    }
                })
            }
            catch(err) {
                res.json({status:'error', message:'Invalid token'})
            }
        }
        else {
            res.json({status:'error', message:'No access token provided'})
        }
    }
}