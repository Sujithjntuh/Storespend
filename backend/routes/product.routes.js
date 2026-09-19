const express = require("express");

const router = express.Router();

const pool = require("../db/pool");

router.get("/" , async (req , res) => {
    const result = await pool.query(
        "SELECT * FROM products"
    );
    res.json({
        products : result.rows,
    });

});

module.exports = router ;