import express from "express";
import cors from "cors";

import "./db/connection.js";
import items from "./routes/item.js";
import users from "./routes/user.js";
import households from "./routes/household.js";
import auth from "./routes/auth.js";
import filter from "./routes/filter.js"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

console.log('hello');

//Item route
app.use("/item", items);
app.use("/user", users);
app.use("/household", households);
app.use("/filter", filter);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Auth route
app.use("/auth", auth);

/*app.post("/signup", async (req, res) => {
  const user = req.body;

  try {
    // Check if valid email and username
    const emailTaken = await User.findOne({email: user.email});
    const usernameTaken = await User.findOne({username: user.username});

    if (emailTaken) {
      res.json({ error: "Email already in use." });
    } else if (usernameTaken) {
      res.json({ error: "Username already in use. Be more original." });
    } else {
      // Create user
      user.password = req.body.password;

      const newUser = new User({
        email: user.email,
        username: user.username,
        password: user.password
      })

      newUser.save();
      res.status(201).json({message: "Account created successfully."});
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/