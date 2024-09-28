import express from "express";
import cors from "cors";
//import records from "./routes/record.js";
import "./db/connection.js"
import items from "./routes/item.js"
import users from "./routes/user.js"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

console.log('hello')

// Record route
//app.use("/record", records);
//app.use("/api/record", records);

//Item route
app.use("/item", items);
app.use("/user", users);


//* Serve static assets in production, must be at this location of this file
/*if (process.env.NODE_ENV === 'production') {
  //*Set static folder up in production
  app.use(express.static('client/build'));

  app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, 'client', 'build','index.html')));
}*/

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});