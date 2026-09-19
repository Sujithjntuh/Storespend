const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const authenticate = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const crypto = require("crypto");

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

router.post("/",authenticate,requireRole("OWNER"),async(req , res)=>{
    const { store_id, product_id, quantity, reorder_level } = req.body;
    if (!store_id || !product_id || quantity === undefined) {
    return res.status(400).json({
        success: false,
        message: "Store, product and quantity are required"
    });
}
    const id = crypto.randomUUID();

    const result = await pool.query(
    `INSERT INTO inventory
     (id, store_id, product_id, quantity, reorder_level)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
        id,
        store_id,
        product_id,
        quantity,
        reorder_level ?? 0
    ]
);

res.status(201).json({
    success: true,
    message: "Inventory created successfully",
    inventory: result.rows[0]
});


});

router.patch("/:id", authenticate, requireRole("OWNER"), async (req, res) => {
    const { reorder_level } = req.body;
    if(reorder_level === undefined || reorder_level < 0){
        return res.status(400).json({
            success :false,
            message : "A valid reorder level is required"
        });
    }

    const result = await pool.query(
        `UPDATE inventory
        SET reorder_level = $1,
            updated_at = now()
        WHERE id = $2
        RETURNING *`,
        [reorder_level , req.params.id]
    );
    if(result.rows.length === 0){
        return res.status(404).json({
            success : false,
            message : "Inventory record not found"
        });
    }

    res.json({
        success: true,
        message : "Reorder level updated Successfully",
        inventory: result.rows[0]
    });
});

module.exports = router;