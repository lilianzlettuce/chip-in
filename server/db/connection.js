//import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from 'mongoose';

//const uri = process.env.ATLAS_URI || "";
const uri = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
//const uri = process.env.MONGODB_URI || "";

try {
  await mongoose.connect(uri);
  console.log("connected to mongodb w/ mongoose");
} catch (err) {
  console.error("error connecting to mongo", err);
}

export default mongoose;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// try {
//   // Connect the client to the server
//   await client.connect();
//   // Send a ping to confirm a successful connection
//   await client.db("admin").command({ ping: 1 });
//   console.log(
//    "Pinged your deployment. You successfully connected to MongoDB!"
//   );
// } catch(err) {
//   console.error(err);
// }

// let db = client.db("employees");

// export default db;