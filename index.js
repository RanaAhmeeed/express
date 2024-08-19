require("dotenv").config();
const express = require("express");
const app = express();
const fs = require("fs")

const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running on Port ${port}`));

//middleware
app.use(express.json());

//get req
app.get("/", (req, res) => {
    fs.readFile("database.json", "utf8", (err, data) => {
        if (err) {
            res.status(400).json({ err });
        }
        if (data) {
            res.status(200).json({ data: JSON.parse(data) });
        }
    });

});

app.post("/", (req, res) => {
    fs.readFile("database.json", "utf8", (err, data) => {
        if (err) {
            return res.status(400).json({ msg: "Error reading database" });
        }
        let database = JSON.parse(data);
        const lastUser = database.users.reduce((prev, current) => {
            return (prev.id > current.id) ? prev : current;
        });
        const newId = lastUser.id + 1;
        const newUser = {
            id: newId,
            name: req.body.name
        };
        database.users.push(newUser);
        fs.writeFile("database.json", JSON.stringify(database, null, 2), (err) => {
            if (err) {
                return res.status(400).json({ msg: "Error writing to database" });
            }
            console.log(req.body);
            res.status(201).json({ msg: "User added successfully", user: newUser });
        });
    });
});

// //put req

app.put("/:id", (req, res) => {
    const { name } = req.body;
    fs.readFile("database.json", "utf8", (err, data) => {
        if (err) {
            return res.status(400).json({ msg: "Error reading database" });
        }

        if (data) {
            let database = JSON.parse(data);
            const users = database["users"];

            users[users.findIndex((e) => e.id == req.params.id)].name = name;
            fs.writeFile("database.json", JSON.stringify(database, null, 2), (err) => {
                if (err) {
                    return res.status(400).json({ msg: "Error writing to database" });
                }
                res.status(201).json({ msg: "User updated successfully", user: database });
            });
        }


    });
});

// //delete req
app.delete("/:id", (req, res) => {
    const id = req.params.id;
    fs.readFile("database.json", "utf8", (err, data) => {
        if (err) res.status(400).json({ err });
        if (data) {
            let database = JSON.parse(data);
            let users = database["users"];
            users = users.filter((e) => e.id != id);
            console.log( users)
            fs.writeFile(
                "database.json",
                JSON.stringify(users, null, 2),
                (err) => {
                    if (err) {
                        res.status(400).json({ err });
                    } else {
                        res.status(201).json({ msg: "user has been deleted", user: users });
                    }
                }
            );
        }
    });
});
