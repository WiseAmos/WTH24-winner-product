import express from "express";
import bodyParser from "body-parser";
import path from 'path';
const { db } = require("./firebase.js");
import { getDatabase, ref, child, get } from "firebase/database";


const app = express();
// const staticMiddleware = express.static("./static"); // Path to the public folder

app.use(express.static(path.join(__dirname, '/static')));

app.get('/announcement', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/post/post.html'));
});

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
get(child(dbRef,req["query"]["path"])).then((snapshot) => {
  if (snapshot.exists()) {
    res.send(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
})


app.post('/data',async(req, res) => {
    res.send("")
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});


