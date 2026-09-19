require("dotenv").config({path : ".env"}); //loads variables from .env
console.log("DATABASE_URL loaded:", Boolean(process.env.DATABASE_URL));
const express = require("express");

const pool = require("./db/pool");
const productRoutes = require("./routes/product.routes");

const app = express(); 
app.use(express.json()); //parsing the req 
app.use("/api/products" , productRoutes);


app.get("/",(req , res) =>{
   

    res.json({
        success : true,
        message :"StoreSpend Backend is running"
    });
});

app.get("/api/health", async(req , res)=>{
    try{
        await pool.query("SELECT NOW()");
        res.json({
           success : true, 
           message : "Database Connection Successful"
        });
    }
    catch(error){
        console.error("Database Connection is faled",error.message);
        res.status(500).json({
            success : false,
            message: error.message
        });
    }
});

app.listen(5000,() => {
console.log("Storespend Backend is running on port 5000")
});

