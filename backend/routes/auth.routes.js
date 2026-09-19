const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
router.get("/me",authenticate ,(req,res) =>{
    res.json({
        success : true,
        user : req.user
    });
});

router.get("/role",authenticate,requireRole("STORE_MANAGER"),(req,res)=>{
    res.json({
        success : true,
        role : req.userRole
    });
});

module.exports = router;