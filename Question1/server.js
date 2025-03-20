const express = require("express");
const cors = require("cors");
require("dotenv").config();

const usersRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
