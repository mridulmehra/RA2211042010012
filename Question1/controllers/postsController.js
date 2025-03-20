const axios = require("axios");
const BASE_URL = process.env.TEST_SERVER_URL;

exports.getPosts = async (req, res) => {
  const { type } = req.query;
  if (!["popular", "latest"].includes(type)) {
    return res.status(400).json({ error: "Invalid type parameter" });
  }

  try {
    const { data } = await axios.get(`${BASE_URL}/users`);
    const userIds = Object.keys(data.users);

    let allPosts = [];

    await Promise.all(
      userIds.map(async (userId) => {
        try {
          const { data } = await axios.get(`${BASE_URL}/users/${userId}/posts`);
          allPosts.push(...data.posts);
        } catch {
          // Ignore errors and continue
        }
      })
    );

    if (type === "latest") {
      return res.json(allPosts.sort((a, b) => b.id - a.id).slice(0, 5));
    }

    if (type === "popular") {
      let commentCounts = {};

      await Promise.all(
        allPosts.map(async (post) => {
          try {
            const { data } = await axios.get(
              `${BASE_URL}/posts/${post.id}/comments`
            );
            commentCounts[post.id] = data.comments.length;
          } catch {
            commentCounts[post.id] = 0;
          }
        })
      );

      const maxCount = Math.max(...Object.values(commentCounts));
      const popularPosts = allPosts.filter(
        (post) => commentCounts[post.id] === maxCount
      );

      return res.json(popularPosts);
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
