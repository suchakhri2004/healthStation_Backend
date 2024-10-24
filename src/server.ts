import express from "express";
import authRoutes from "./routes/authRoutes";
import usersRoutes from "./routes/usersRoutes";
import formRoutes from "./routes/formRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

const app = express();
const port = process.env.PORT;

var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/form", formRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
