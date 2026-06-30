const bcrypt = require("bcrypt");

const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const { UserModel } = require("./db");
const { TodoModel } = require("./db");
const { auth } = require("./auth");
const { JWT_SECRET } = require("./auth");
const jwt = require("jsonwebtoken");
const dns = require("dns");
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

// zod lib

const { z } = require("zod");
// mongoose library
const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://pandyadhruv67_db_user:942v8bQwTGieURGF@cluster0.nbd7hw5.mongodb.net/todo-db")


app.use(express.json());

// signup

app.post("/", (req, res) => {
    res.send("chalu hogya bhai backend!");
})

app.post("/signup", async (req, res) => {

    // making zod object!!m
    // const requiredBody = z.object({
    //     email:z.string().min(3).max(100).email(),
    //     name:z.string().min(3).max(100),
    //     password:z.string().min(3).max(3)
    // });


    // getting the values in variables
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    // console.log("Yaha pe aayi he error!!");
    // using bcrypt!
    try{
    const hashedPassword = await bcrypt.hash(password,5);
    // putting the values in db
    await UserModel.create({
        email: email,
        password: hashedPassword,
        name: name
    });
}
    catch(e)
    {
       console.log("Error aa gahi")
    }

    res.json({
        message: "You are signed up"
    })
});

// singin 


app.post("/signin", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email: email
    })
    if(!response)
    {
        res.status(403).json({
            message:"User does not exists"
        })
        return;
    }
  
    const passwordMatch = await bcrypt.compare(password,response.password);
    if (passwordMatch) {
        const token = jwt.sign({
            id: response._id.toString()
        }, JWT_SECRET);
        res.json({
            token: token
        })
    }
    
    else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
});

// now you have to add todo

app.post("/addTodo", auth, async (req, res) => {
    const userId = req.userId;
    const title = req.body.todo;
    const done = req.body.done;

    await TodoModel.create({
        userId: userId,
        title: title,
        done: done
    })
    res.json({
        message: "Todo added successfully!"
    })
})


// now you have to display all the todos created by the user!

app.get("/getTodos", auth, async (req, res) => {
    const userId = req.userId;
    const todos = await TodoModel.find({ userId });
    res.send(todos);
})



app.listen(3001);

// yeyeye bc we have made our first todo application!!!!!!
