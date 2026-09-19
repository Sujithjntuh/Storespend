const pool = require("../db/pool");

function requireRole(...allowedRoles){
    return async (req ,res , next) =>{
        try{
            const result = await pool.query(
                `SELECT role FROM profiles WHERE id = $1`,
                [req.user.id]
            );

            if(result.rows.length === 0){
                return res.status(403).json({
                    success : false,
                    message : "User Profile not found"
                });
            }
            const userRole = result.rows[0].role;
            if(!allowedRoles.includes(userRole)){
                return res.status(403).json({
                    success : false,
                    message : "You do not have permission to perform this action"
                });
            }

            req.userRole = userRole;
            next();
        }
        catch(error){
            console.error("RBAC error ",error.message);
            return res.status(500).json({
                success : false,
                message : "Authorisation failed"
            });
        }
    }
}

module.exports = requireRole;