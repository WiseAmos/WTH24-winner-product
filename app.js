import express from "express";
import bodyParser from "body-parser";
import path from 'path';
const { db } = require("./firebase.js");
import { getDatabase, ref, child, get } from "firebase/database";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));


// Routes for html page
app.get("/home", async(req, res) => {
    res.sendFile(path.join(__dirname + "/static/home/home.html"));
});

app.get("/foodDetails", async(req, res) => {
    res.sendFile(path.join(__dirname + "/static/Posting Form/index.html"));
});

app.get('/data', async(req, res)=>{

const dbRef = ref(getDatabase());
get(child(dbRef,req["path"])).then((snapshot) => {
  if (snapshot.exists()) {
    res.send(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});
