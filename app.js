import express from "express";
import bodyParser from "body-parser";
import path from 'path';
const { db } = require("./firebase.js");
import { getDatabase, ref, child, get } from "firebase/database";


const app = express();

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
    const data = snapshot.val();
    const filteredData = Object.values(data).filter(item => item !== null); 
    res.send(filteredData);
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
})

// async function getData() {
//     const url = "/data";
//     try {
//       const response = await fetch(url+"?path=users");
//       if (!response.ok) {
//         throw new Error(`Response status: ${response.status}`);
//       }
  
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error(error.message);
//     }
//   }


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});


