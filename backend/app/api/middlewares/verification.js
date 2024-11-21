const jwt       = require('jsonwebtoken')
const config    = require("../../../config/config")
const db        = require("../../../config/db")

module.exports = {
    tokenAuth: (req, res, next) => {
        const authHeader = req.headers.authorization
        if(authHeader) {
            try {
                const accessToken = authHeader.split(' ')[1]
                const accessTokenDecoded = jwt.verify(accessToken, config.ACCESS_TOKEN_PRIVATE_KEY)
                db.query("SELECT * FROM tbl_users WHERE id="+db.escape(accessTokenDecoded.id)+" AND is_active='1' AND is_deleted='0'", (err, userInfo) => {
                    if(err) {
                        next(err)
                    }
                    else {
                        global.user_info = userInfo
                        next()
                    }
                })
            }
            catch(err) {
                res.json({status: "error", message: "Invalid token"})
            }
        }
        else {
            res.json({status: "error", message: "No access token provided"})
        }
    }
}