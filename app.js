import express from "express";
import bodyParser, { json } from "body-parser";
import path from 'path';
import admin from "firebase-admin";
const { db } = require("./firebase.js");
import { update,set,push, getDatabase, ref, child, get } from "firebase/database";
import exp from "constants";
const jwt = require('jsonwebtoken'); 
const SECRET_KEY = 'your-secret-key'; 
const axios = require('axios');
const app = express();

app.use(express.static(path.join(__dirname, '/static')));
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/signup', (req,res) => {
  res.sendFile(path.join(__dirname + '/public/html/signup.html'))
});
app.get('/signup/signup-volunteer', (req,res) => {
  res.sendFile(path.join(__dirname + '/public/html/signup-volunteer.html'))
});
app.get('/signup/signup-food', (req,res) => {
  res.sendFile(path.join(__dirname + '/public/html/signup-food.html'))
});
app.get('/signup/signup-Organization', (req,res) => {
  res.sendFile(path.join(__dirname + '/public/html/signup-Organization.html'))
});
app.get('/signup/signup-Normal', (req,res) => {
  res.sendFile(path.join(__dirname + '/public/html/signup-Normal.html'))
});
app.get('/login', (req,res) => {
  res.sendFile(path.join(__dirname + '/public/html/login.html'))
});

app.get('/announcement', (req, res) => {
    res.sendFile(path.join(__dirname + '/static/post/post.html'));
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

// app.get("/request", async(req, res) => {
//     res.sendFile(path.join(__dirname + "/static/request/request.html"));
// });

app.get("/request/create", async(req, res) => {
  res.sendFile(path.join(__dirname + "/static/requestCreate/requestCreate.html"));
});

app.get("/foodDetails", async(req, res) => {
    res.sendFile(path.join(__dirname + "/static/Posting Form/index.html")); 
});

app.get("/map", async(req, res) => {
  res.sendFile(path.join(__dirname + "/static/map/map.html"));
});

app.get("/organisation", async(req, res) => {
    res.sendFile(path.join(__dirname + "/static/organisation/organisation.html"));
});

app.get("/organisation/edit", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/organisation/edit.html"));
});


app.get("/organisation/new", async (req, res) => {
  res.sendFile(path.join(__dirname + "/static/organisation/new.html"));
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
  
      await update(usersRef, received["data"]);  // Update with filtered data
  
      console.log("Successfully updated, YOU CAN'T DELETE IT NOW :D!");
      res.status(200).send({ success: true });
    } catch (error) {
      console.error("Error updating :( -> ", error.message);
      res.status(500).send({ success: false, error: error.message });
    }
  });

app.post('/announcement', async (req, res) => {
  try {
    const { path, data } = req.body;

    const announcementsRef = ref(db, "data/" + path);
    const newKey = push(announcementsRef).key;

    const updateData = {};
    updateData[newKey] = data;
    await update(announcementsRef, updateData);

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error while posting announcement:", error.message);
    res.status(500).send({ success: false, error: error.message });
  }
});

// POST Route to Update an Existing Announcement
app.post("/announcement/update", async (req, res) => {
  const { category, id, data } = req.body; // category=food, id=uniqueKey, data={updated fields}
  try {
    if (!category || !id || !data) {
      return res.status(400).send({ error: "Category, ID, and data are required" });
    }

    const announcementRef = ref(db, `data/announcements/${category}/${id}`);
    await update(announcementRef, data);

    console.log(`Announcement ${id} in category ${category} updated successfully!`);
    res.status(200).send({ success: true, message: "Announcement updated successfully!" });
  } catch (error) {
    console.error("Error updating announcement:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// POST Route to Create a New Announcement
app.post("/announcement/new", async (req, res) => {
  
})


// Fetch details for a specific announcement
app.get("/announcement/details", async (req, res) => {
  const { category, id } = req.query;

  if (!category || !id) {
    return res.status(400).send({ error: "Category and ID are required" });
  }

  try {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `data/announcements/${category}/${id}`));

    if (snapshot.exists()) {
      res.status(200).json({ id, category, ...snapshot.val() });
    } else {
      res.status(404).send({ error: "Announcement not found" });
    }
  } catch (error) {
    console.error("Error fetching announcement details:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
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


// Route to update food request status
app.put("/updateFoodRequestStatus", async (req, res) => {
  const { foodId, status } = req.body;

  if (!foodId || !status) {
    return res.status(400).json({ error: "foodId and status are required" });
  }

  try {
    // Get a reference to the food request in the database
    const db = getDatabase();
    const foodRequestRef = ref(db, `data/foodRequests/${foodId}`);
    console.log(status);

    // Update the status field of the food request
    await update(foodRequestRef, {
      status: status,
    });

    // Send success response
    return res.status(200).json({ message: "Food request status updated successfully" });
  } catch (error) {
    console.error("Error updating food request status:", error);
    return res.status(500).json({ error: "Failed to update food request status" });
  }
});

// Route to update special request status
app.put("/updateSpecialRequestStatus", async (req, res) => {
  const { requestId, status } = req.body;

  if (!requestId || !status) {
    return res.status(400).json({ error: "requestId and status are required" });
  }

  try {
    // Get a reference to the special request in the database
    const db = getDatabase();
    const specialRequestRef = ref(db, `data/specialRequests/${requestId}`);
    console.log(status);

    // Update the status field of the special request
    await update(specialRequestRef, {
      status: status,
    });

    // Send success response
    return res.status(200).json({ message: "Special request status updated successfully" });
  } catch (error) {
    console.error("Error updating special request status:", error);
    return res.status(500).json({ error: "Failed to update special request status" });
  }
});


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




app.post('/login', async (req, res) => {
  const { accountName, password } = req.body; // Get accountName and password from request body

  if (!accountName || !password) {
      return res.status(400).send({ success: false, message: 'Account Name and Password are required.' });
  }

  try {
      const dbRef = ref(getDatabase());
      const path = "users"; // Path to all user accounts

      // Fetch all accounts from the database
      const snapshot = await get(child(dbRef, `data/${path}`));

      if (snapshot.exists()) {
          const accounts = snapshot.val(); // JSON of accounts

          // Check if the accountName exists
          if (accounts[accountName]) {
              const account = accounts[accountName];

              // Validate the password
              if (account.password === password) {
                  // Generate JWT
                  const token = jwt.sign(
                      {
                          accountName: accountName,
                          role: account.role,
                      },
                      SECRET_KEY,
                      { expiresIn: '1h' } // Token expires in 1 hour
                  );

                  return res.send({
                      success: true,
                      message: 'Login successful!',
                      token: token, 
                      data: {
                          accountName: accountName,
                          role: account.role,
                          
                      },
                  });
              } else {
                  return res.status(401).send({ success: false, message: 'Invalid password.' });
              }
          } else {
              return res.status(404).send({ success: false, message: 'Account not found.' });
          }
      } else {
          return res.status(404).send({ success: false, message: 'No user data found in the database.' });
      }
  } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).send({ success: false, message: 'Internal server error.' });
  }
});

app.post('/signup', async (req, res) => {
  try {
      const received = req.body;
      console.log("Path:", received["path"]);
      console.log("Data:", received["data"]);

      const usersRef = ref(db, "data/" + received["path"]);
      const newKey = push(usersRef).key; // Use filtered data for update
      await update(usersRef, received["data"]); // Update with filtered data

      console.log("Successfully updated, YOU CAN'T DELETE IT NOW :D!");

      // Extract AccountName and AccountRole for JWT
      const accountName = Object.keys(received["data"])[0]; // Extract AccountName
      const accountRole = received["data"][accountName].role; // Extract AccountRole

      // Generate a JWT Token
      const token = jwt.sign(
          {
              accountName: accountName,
              accountRole: accountRole,
          },
          SECRET_KEY,
          { expiresIn: '1h' } // Token valid for 1 hour
      );

      // Respond with the token
      res.status(200).send({ success: true, token: token });
  } catch (error) {
      console.error("Error updating :( -> ", error.message);
      res.status(500).send({ success: false, error: error.message });
  }
});

app.post("/predict", async (req, res) => {
  try {
    // Forward the request data (date and weather) to the Python service
    const response = await axios.post("http://localhost:5001/predict", req.body);

    
    res.json({
      success: true,
      predictions: response.data, 
    });
  } catch (error) {
    console.error("Error calling the Python service:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to make predictions.",
      error: error.response ? error.response.data : error.message, 
    });
  }
});

// Serve the unique_stalls.csv file
app.get('/unique_stalls.csv', (req, res) => {
  res.sendFile(path.join(__dirname, 'unique_stalls.csv'));
});