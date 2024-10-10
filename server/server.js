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