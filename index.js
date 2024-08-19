require("dotenv").config();
const express = require("express");
const app = express();

const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running on Port ${port}`));

//middleware
app.use(express.json());

//get req
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Get Request" });
});

//post req
app.get("/", (req, res) => {
    res.status(201).json({ msg: "Post Request" });
    console.log(req.body);
});