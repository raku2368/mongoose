const express = require("express");
const app = express();
const mongoose = require('mongoose')

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mycluster.84tel.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  {useNewUrlParser: true, useUnifiedTopology: true }
);
  
var db = mongoose.connection;
  
db.on("error", console.error.bind(console, "connection error:"));
  
db.once("open", function() {
      console.log("Connection To MongoDB Atlas Successful!");
});

require("./models/player");
const playerModel = mongoose.model("Player");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.get("/", (request, response) => {
  response.send("Hi");
});

app.get("/player-data/:id", async (request, response) => {
  async function playerDataCheck() {
    const playerData = await playerModel.findOne({
      userID: `${request.params.id}`
    });

    if (playerData) {
      return playerData;
    } else {
      const newPlayerDataInstance = new playerModel({
        userID: `${request.params.id}`,
        coins: 0 
      });

      const newPlayerData = await newPlayerDataInstance.save();

      return newPlayerData;
    }
  }

  response.json(await playerDataCheck());
});

app.get("/player-data/:id/:coins", async (request, response) => {
  await playerModel.findOneAndUpdate(
    { userID: `${request.params.id}` },
    { $set: { coins: `${request.params.coins}` } }
  );
   console.log('requestParamsId', request.params.id);
  response.send("Updated Database.");
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
