const express = require("express");

const router = express.Router();

const pool = require("../db/pool");
const authenticate = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");

const crypto = require("crypto"); //for random uuids

router.get("/" , authenticate,async (req , res) => {
    const result = await pool.query(
        "SELECT * FROM products"
    );
    res.json({
        products : result.rows,
    });

});

router.post("/",authenticate,requireRole("OWNER"),async(req,res)=>{
    const {name ,sku,category_id,unit,reorder_level} = req.body;
    if(!name || !sku){
        return res.status(400).json({
            success :false,
            message : "Product name and SKU are required"
        });
    }

    const id = crypto.randomUUID();
    const result = await pool.query(
        `INSERT INTO products
        (id,name,sku,category_id,unit,reorder_level)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *`,
        [id,name,sku,category_id,unit || "piece",reorder_level || 0]
    );
    res.status(201).json({
        success :true,
        message : "Product created Successfully",
        product : result.rows[0]
    });

});

module.exports = router ;