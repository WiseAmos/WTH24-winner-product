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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));


// Routes for html page
app.get("/home", async(req, res) => {
    res.sendFile(path.join(__dirname + "/static/home/home.html"));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/signup.html'));
});
app.get('/signup/signup-volunteer', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/signup-volunteer.html'));
});

app.get("/foodDetails", async(req, res) => {
    res.sendFile(path.join(__dirname + "/static/Posting Form/index.html")); 
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
      const newKey = push(usersRef).key;
  
      const updateData = {};
      updateData[newKey] = filteredData; // Use filtered data for update
      await update(usersRef, updateData);  // Update with filtered data
  
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
  const { category, data } = req.body;

  try {
    if (!category || !data) {
      return res.status(400).send({ error: "Category and data are required" });
    }

    const announcementsRef = ref(db, `data/announcements/${category}`);
    const newKey = push(announcementsRef).key;

    const updateData = {};
    updateData[newKey] = data;

    await update(announcementsRef, updateData);

    console.log(`New announcement created in category ${category}!`);
    res.status(200).send({ success: true, message: "New announcement created successfully!" });
  } catch (error) {
    console.error("Error creating announcement:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});


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


