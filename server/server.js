import express from "express";
import cors from "cors";

import "./db/connection.js";
import items from "./routes/item.js";
import users from "./routes/user.js";
import households from "./routes/household.js";
import auth from "./routes/auth.js";
import filter from "./routes/filter.js"
import notes from "./routes/alert.js"

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

// Auth route
app.use("/auth", auth);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

export default app;

// start the Express server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
