import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/message", async (req, res) => {
  try {
    const data = {
      message: "Hi there from backend! All working!",
      FEMessage: req.body,
    };
    res.json(data);
  } catch (error) {
    console.error(error);
  }
});

app.get("/", (req, res) => {
  try {
    res.json({ message: "Hi there from backend!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port: ${PORT}`);
});
