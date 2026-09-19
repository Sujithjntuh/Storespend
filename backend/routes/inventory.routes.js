const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const authenticate = require("../middleware/auth.middleware");

router.get("/",authenticate , async(req , res)=>{
    const result = await pool.query(
        `SELECT *
        FROM inventory
        ORDER BY updated_at DESC`
    );
    res.json({
        success : true,
        inventory : result.rows
    });
});

module.exports = router;