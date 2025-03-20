require("dotenv").config();
const axios = require("axios");

const BASE_URL = process.env.TEST_SERVER_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

exports.getTopUsers = async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });

    const users = data.users;
    let userPostCounts = {};

    const postRequests = Object.keys(users).map(async (userId) => {
      try {
        const { data } = await axios.get(`${BASE_URL}/users/${userId}/posts`, {
          headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        });
        userPostCounts[userId] = data.posts.length;
      } catch {
        userPostCounts[userId] = 0;
      }
    });

    await Promise.all(postRequests);

    const topUsers = Object.entries(userPostCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({
        id,
        name: users[id],
        postCount: count,
      }));

    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
