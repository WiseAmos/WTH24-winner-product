import express from "express";
import bodyParser from "body-parser";

const app = express();
const staticMiddleware = express.static("./public"); // Path to the public folder

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
