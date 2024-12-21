import express from "express";
import bodyParser, { json } from "body-parser";
import path from 'path';
const { db } = require("./firebase.js");
import { update,set,push, getDatabase, ref, child, get } from "firebase/database";


const app = express();

app.use(express.static(path.join(__dirname, '/static')));

app.get('/announcement', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/post/post.html'));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));

app.get("/volunteerHome", async(req, res) => {
    res.sendFile(path.join(__dirname + "/static/volunteerHome/volunteerHome.html"));
});

// Routes for html page
app.get("/home", async(req, res) => {
    res.sendFile(path.join(__dirname + "/static/home/home.html"));
});

app.get("/foodDetails", async(req, res) => {
    res.sendFile(path.join(__dirname + "/static/Posting Form/index.html")); 
});
app.get('/data', async (req, res) => { 
  const dbRef = ref(getDatabase()); 
 
  get(child(dbRef, "data/" + req.query.path)) 
    .then((snapshot) => { 
      if (snapshot.exists()) { 
          const data = snapshot.val(); 
          // Directly return the raw data from the snapshot 
          const filteredData = Object.entries(data) 
          .filter(([key, value]) => value !== null) 
          .map(([key, value]) => ({ key, value })); 
          const jsonData = filteredData.reduce((acc, item) => { 
              acc[item.key] = item.value; 
              return acc; 
          }, {}); 

          res.json(jsonData); 
      } else { 
        res.status(404).send({ error: "No data available" }); 
      } 
    }) 
    .catch((error) => { 
      console.error(error); 
      res.status(500).send({ error: "Internal Server Error" }); 
    }); 
});
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
      const newKey = push(usersRef).key; // Use filtered data for update
      await update(usersRef, received["data"]);  // Update with filtered data
  
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


  app.get('/recomendations', async (req, res) => {
    const username = req.query.user.split("?")[0]
    const action = req.query.user.split("?")[1]
    const otherinfo = await fetch("http://localhost:3000/data?path=announcements")
    const otherinforejson = await otherinfo.json()
    const reponsestring =  JSON.stringify(otherinforejson)
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI("AIzaSyCXb4dtQZq2uk5IHv-cZ75dmniMBMNwCJw");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `"base on this user `+username+` and also on other relevant information regarding the organisation
    and volunteers and food places return in a json format on whether if this person needs a volueenter and  which organisation
    voluenteer and food stall may be able to help this person. The plan may consists of using more then an organisation volunteer
    and food place to help this person or it could use non as well. This user also happen to choose event with the title `+action+` hence please provide the according information for voluenteer_data base on the selected event. For exmaple if they choose Giving out free clothes for Christmas! 
    use the data 
    {
      "createdBy": "helping_hands_account",
      "date": "24 December 2024",
      "description": "We have a variety of clothes available for free distribution. Merry Christmas, hohoho. Come and pick your favorites!",
      "image": "https://th.bing.com/th/id/OIP.Yq3fgpjpo3oMbQQMoK7orAHaEK?w=750&h=422&rs=1&pid=ImgDetMain",
      "location": "456 Donation Drive, City B, Singapore 123456",
      "quantityLeft": 20,
      "time": "1500 - 2000",
      "timestamp": "2024-12-21T14:04:02.430Z",
      "title": "Giving out free clothes for Christmas!",
      "totalQuantity": 30
    }
    Please return it in the below format when submitting a reqest for needing voluenteering assitance. Take note to only return what it in the format strictly.
    START FORMAT
    {
    need_help: true
    voluenteer_data: {
      "createdBy": "john_doe_account",
      "date": "2024-12-21T14:04:02.446Z",
      "details": "Need help collecting food please!",
      "foodID": 2,
      "location": "123 Main Street, City",
      "status": "pending",
      "time": "10:04:02 pm",
      "timestamp": "2024-12-21T14:04:02.446Z"
    }
    recomendations: 
    {
    recomended:[{
    type: clothes
    id : 2
    title : "Free clothes for all"
  }]
    }
  }
  END FORMAT
  This are the other releveant information -> `+reponsestring; 
    const result = await model.generateContent(prompt);
    const json_result_promt = JSON.parse(result.response.text().substring(7,result.response.text().length-4));
      const reqest = await fetch("http://localhost:3000/data?path=foodRequests")
      const requests_id_clean = await reqest.json()
      const id = Object.keys(requests_id_clean).length+1
      if (json_result_promt["need_help"]){  
        console.log(id)
        const data = {"path":"foodRequests/"+id,"important_data":json_result_promt["voluenteer_data"]}
        console.log(data)
        res.json(data)
      }
  });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});


