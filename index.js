const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

const {MongoClient,ServerApiVersion, ConnectionClosedEvent} = require("mongodb");
const uri = "mongodb+srv://chaitanyasaim5:chaitanyasai@cluster0.klesare.mongodb.net/GPS_Tracker";
const client = new MongoClient(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    serverApi:ServerApiVersion.v1,
});
client.connect;

app.get("/home",(req,res)=>{
    var lat = req.body.latitude;
    var lon = req.body.longitude;
    

    
})
app.post("/home", async (req, res) => {
  var latitude = req.body.latitude || req.query.latitude;
  var longitude = req.body.longitude || req.query.longitude;
  var _id = req.body._id || req.query._id;
  var accuracy = req.body.accuracy || req.query.accuracy;
  var date = req.body.formattedDate || req.query.formattedDate; // Renamed from 'Date' to 'date' to avoid conflict with JavaScript Date object
  const collection = client.db().collection("location");

  const existingUser = await collection.findOne({ _id });

  if (existingUser) {
    // User exists in the database
    if (latitude !== "" && longitude !== "") {
      // Both lat and lon are not null, update the user data
      existingUser[date] = existingUser[date] || [];
      existingUser[date].push({ latitude, longitude, accuracy });
      await collection.updateOne({ _id }, { $set: { [date]: existingUser[date] } });
      res.status(200).json({ message: "User data updated successfully" });
    } else {
      // Either lat or lon is null, no update needed
      res.status(200).json({ message: "User data not updated" });
    }
  } else {
    // User does not exist, insert new user if lat and lon are not null
    if (latitude !== "" && longitude !== "") {
      const GPS = [{ latitude, longitude, accuracy }];
      const userData = { _id, [date]: GPS };
      await collection.insertOne(userData);
      res.status(200).json({ message: "User data inserted successfully" });
    } else {
      res.status(200).json({ message: "User data not inserted" });
    }
  }
});

// app.post("/home", async (req, res) => {
//   const latitude = req.query.latitude ;
//   const longitude = req.query.longitude;
//   const accuracy = req.query.accuracy;
//   const formattedDate = req.query.formattedDate;
//   const _id = req.query._id;

//   if (latitude && longitude && accuracy && formattedDate && _id) {
//     const collection = client.db().collection("location");
//     const existingUser = await collection.findOne({ _id });

//     if (existingUser) {
//       // User exists in the database, update the user data
//       existingUser[formattedDate] = existingUser[formattedDate] || [];
//       existingUser[formattedDate].push({ latitude, longitude, accuracy });
//       await collection.updateOne({ _id }, { $set: { [formattedDate]: existingUser[formattedDate] } });
//       res.status(200).json({ message: "User data updated successfully" });
//     } else {
//       // User does not exist, insert new user
//       const GPS = [{ latitude, longitude, accuracy }];
//       const userData = { _id, [formattedDate]: GPS };
//       await collection.insertOne(userData);
//       res.status(200).json({ message: "User data inserted successfully" });
//     }
//   } else {
//     res.status(400).json({ message: "Invalid parameters provided" });
//   }
// });



  
  

app.post("/signup",async(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;

    const collection = client.db().collection("users");

    try{
        await collection.insertOne({_id:username,password:password});
        res.send("Succesfully Posted");

    }catch(e){
        console.log(e);
    }
})

app.get("/users",async(req,res)=>{
    const collection = client.db().collection("users");
    
    try{
        const allUsers =await collection.find().toArray();
        console.log(allUsers);
        res.send(allUsers);
    }catch(e){
        console.log(e);
    }
    
})

app.get("/admin",async(req,res)=>{
    const collection = client.db().collection("location");
    
    try{
        const allUsers =await collection.find().toArray();
        console.log(allUsers);
        res.send(allUsers);
    }catch(e){
        console.log(e);
    }
    
})

app.post("/admins",async(req,res)=>{
  const adminname = req.body.adminname;
  const password = req.body.password;

  const collection = client.db().collection("admins");

  try{
    await collection.insertOne({_id:adminname,password:password});
    res.send("Succesfully Posted");

  }catch(e){
    console.log(e);
  }

  
})


app.get("/admins",async(req,res)=>{
  const collection = client.db().collection("admins");

  try{
    const allAdmins = await collection.find().toArray();
    console.log(allAdmins);
    res.send(allAdmins);

  }catch(e){
    console.log(e);
  }
})

app.get("/kiruba",async(req,res)=>{
  const collection = client.db().collection("location");

  try{
    const user = await collection.find().toArray();
    if(user){
      for(var i=0;i<user.length;i++){
        if(user[i]._id === "kiruba"){
          const lastDate = Object.keys(user[i]).pop();
          const output = user[i][lastDate];
          res.send(output);
          return ;
        }
      }
      res.send([]);
    }else{
      console.log("user not found");
    }

  }catch(e){
    console.log(e);
  }

})


app.listen("4000",()=>{
    console.log("Connected to the Server 4000");
})


