import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import geminiRoutes from "./routes/geminiRoutes.js";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/gemini", geminiRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
