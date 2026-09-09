const express = require("express");

const app = express();


app.get("/",(req , res) =>{
    res.send("Storespend is running");
})

app.listen(5000,() => {
console.log("Storespend Backend is running on port 5000")
});

