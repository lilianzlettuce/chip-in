import express from "express";
import cors from "cors";
//import records from "./routes/record.js";
import "./db/connection.js";
import items from "./routes/item.js";
import users from "./routes/user.js";
import households from "./routes/household.js";

import User from "./models/User.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

console.log('hello');

// Record route
//app.use("/record", records);
//app.use("/api/record", records);

//Item route
app.use("/item", items);
app.use("/user", users);
app.use("/household", households);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.post("/signup", async (req, res) => {
  const user = req.body;

  console.log("in app.post");
  console.log(user);

  try {
    // Check if valid email and username
    const emailTaken = await User.findOne({email: user.email});
    const usernameTaken = await User.findOne({username: user.username});

    if (emailTaken) {
      console.log("email in use")
      res.json({message: "Email already in use."});
    } else if (usernameTaken) {
      console.log("username in use")
      res.json({ error: "Username already in use. Be more original." });
    } else {
      console.log("create user")
      // Create user
      user.password = req.body.password;

      const newUser = new User({
        email: user.email,
        username: user.username,
        password: user.password
      })

      newUser.save();
      //res.json({message: "Success"});
      res.status(201).json(newUser);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});