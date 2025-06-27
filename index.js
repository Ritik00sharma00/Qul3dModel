import express from "express";
import dotenv from "dotenv";
import   connectDB  from "./dbconfig/dbconfig.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import userroutes from "./routes/user_routes.js";
import filerouter from "./routes/file_route.js";
import { authorize } from "./middlewares/authorization_middleare.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded())

app.use('/assets', express.static(path.join(process.cwd(), 'assets')));



app.get("/", (req, res) => {
  res.send("API is running");
});


app.use("/api/v1/",userroutes)
app.use("/api/v1/",authorize,filerouter);
app.use('/assets', express.static('assets'));



app.use((err, req, res, next) => {
  console.error(err.stack);
  console.log("Error occurred:", err.message);
  res.status(500).send(JSON.stringify(err.message) || "Internal Server Error");
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'MERN Backend'
  });
});






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


