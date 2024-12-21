import express from "express";
import bodyParser from "body-parser";
import path from 'path';
const { db } = require("./firebase.js");
import { update,set,push, getDatabase, ref, child, get } from "firebase/database";


const app = express();

app.use(express.static(path.join(__dirname, '/static')));

app.use(express.static(path.join(__dirname, '/public')));

app.get('/announcement', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/post/post.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/signup.html'));
});
app.get('/signup/signup-volunteer', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/signup-volunteer.html'));
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



//EXAMPLE
// async function getData() {
//     const url = "/data";
//     try {
//       const response = await fetch(url+"?path=   ");
//       if (!response.ok) {
//         throw new Error(`Response status: ${response.status}`);
//       }
  
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error(error.message);
//     }
//   }

//   getData()
app.post('/data', async (req, res) => {
    try {
      const received = req.body;
      console.log("Path:", received["path"]);
      console.log("Data:", received["data"]);
  
      const usersRef = ref(db, "data/" + received["path"]);
      const newKey = push(usersRef).key;
  
      const updateData = {};
      updateData[newKey] = received["data"];
      await update(usersRef, updateData);
  
      console.log("Successfully updated, YOU CAN'T DELETE IT NOW :D!");
      res.status(200).send({ success: true });
    } catch (error) {
      console.error("Error updating :( -> ", error.message);
      res.status(500).send({ success: false, error: error.message });
    }
  });

//EXAMPLE
//   async function postData() {
//     const url = "/data";
//     try {
//       const response = await fetch("/data", {
//         method: "POST",
//         body: JSON.stringify({
//           path:"users",
//           data: {volunteer1:{
//             role: "volunteer",
//             image: "https://example.com/image.jpg",
//             name: "Ian douglas",
//             dob: "2006-06-15",
//             email: "charlie.brown@example.com",
//             phone: "+3344556677",
//             password: "volunteerpassword123"
//           }}
//         }),
//         headers: {
//           "Content-type": "application/json; charset=UTF-8"
//         }
//       });
//       if (!response.ok) {
//         throw new Error(`Response status: ${response.status}`);
//       }
  
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error(error.message);
//     }
//   }

//   postData()


  app.get('/nukedatabase', async (req, res) => {
    try {
      // Reference to the root of the database
      const rootRef = ref(db,"data/"+req["query"]["path"]);
  
      // Set the root to null to delete all data
      await set(rootRef, null);
  
      console.log("Database successfully nuked!");
      res.status(200).send({ success: true, message: "Database successfully nuked!" });
    } catch (error) {
      console.error("Error nuking database -> ", error.message);
      res.status(500).send({ success: false, error: error.message });
    }
  });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});


