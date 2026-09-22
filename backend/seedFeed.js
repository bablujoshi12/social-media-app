const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

// ===============================
// USERS
// ===============================

const usersData = [
  {
    username: "bablu01",
    email: "bablu01@gmail.com",
    password: "Password@123",
    bio: "MERN Developer 🚀",
  },
  {
    username: "mansi01",
    email: "mansi01@gmail.com",
    password: "Password@123",
    bio: "Frontend Developer 💻",
  },
  {
    username: "rahul01",
    email: "rahul01@gmail.com",
    password: "Password@123",
    bio: "Learning Node.js 🔥",
  },
  {
    username: "priya01",
    email: "priya01@gmail.com",
    password: "Password@123",
    bio: "Just enjoying life 🌸",
  },
  {
    username: "aman01",
    email: "aman01@gmail.com",
    password: "Password@123",
    bio: "Tech enthusiast ⚡",
  },
  {
    username: "rohit01",
    email: "rohit01@gmail.com",
    password: "Password@123",
    bio: "Code. Sleep. Repeat. 💻",
  },
  {
    username: "neha01",
    email: "neha01@gmail.com",
    password: "Password@123",
    bio: "Creative soul ✨",
  },
  {
    username: "arjun01",
    email: "arjun01@gmail.com",
    password: "Password@123",
    bio: "Full Stack Developer 🚀",
  },
  {
    username: "kavya01",
    email: "kavya01@gmail.com",
    password: "Password@123",
    bio: "Coffee & Coding ☕",
  },
  {
    username: "simran01",
    email: "simran01@gmail.com",
    password: "Password@123",
    bio: "Exploring the world 🌍",
  },
];

// ===============================
// FOLLOW RELATIONSHIPS
// ===============================

const followMap = {
  bablu01: ["mansi01", "rahul01"],

  mansi01: ["bablu01", "priya01", "aman01"],

  rahul01: ["bablu01", "rohit01"],

  priya01: ["mansi01", "neha01"],

  aman01: ["mansi01", "arjun01"],

  rohit01: ["rahul01", "kavya01"],

  neha01: ["priya01", "simran01"],

  arjun01: ["aman01", "kavya01"],

  kavya01: ["rohit01", "arjun01"],

  simran01: ["neha01", "bablu01"],
};

// ===============================
// POSTS
// ===============================

const postsData = {
  bablu01: [
    {
      caption: "Working on my MERN project 🚀💻",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096421/01_1_A_realistic_Instagram-s_hhnp8k.jpg",
    },
    {
      caption: "Mountain views and a peaceful morning 🏔️✨",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096421/02_2_A_cinematic_travel_phot_msnkhf.jpg",
    },
  ],

  mansi01: [
    {
      caption: "Coffee + coding ☕💻 Perfect combination.",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096500/03_3_A_realistic_Instagram_f_o99hcw.jpg",
    },
    {
      caption: "Just another beautiful day ✨",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096500/04_4_A_realistic_photograph__dxaito.jpg",
    },
  ],

  rahul01: [
    {
      caption: "Chasing new experiences and making memories 📸🔥",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096577/05_5_A_cinematic_photograph__ijvuuj.jpg",
    },
    {
      caption: "Nature always has the best views 🏔️🌲",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096576/06_6_A_breathtaking_landscap_gbbpgy.jpg",
    },
  ],

  priya01: [
    {
      caption: "Good food, good mood 🍜❤️",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096642/07_7_A_realistic_Instagram-s_mtl41u.jpg",
    },
    {
      caption: "A cozy evening and some peaceful moments ☕🌧️",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096641/08_8_A_cozy_evening_photogra_rfi4ba.jpg",
    },
  ],

  aman01: [
    {
      caption: "Exploring the city one street at a time 🌆📸",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096688/09_9_A_realistic_street_phot_nfv36r.jpg",
    },
    {
      caption: "Sunsets never get old 🌅✨",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096727/10_10_A_beautiful_sunset_bea_zbpuaa.jpg",
    },
  ],

  rohit01: [
    {
      caption: "Taking a break and enjoying the little things ☕✨",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096802/11_11_A_realistic_Instagram-_d5iwhs.jpg",
    },
    {
      caption: "Roads, mountains and good vibes 🏍️🏔️",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096851/12_12_A_cinematic_photograph_k1ejwu.jpg",
    },
  ],

  neha01: [
    {
      caption: "Sometimes all you need is a little peace 🌿✨",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096875/13_13_A_realistic_photograph_ka9agu.jpg",
    },
    {
      caption: "A productive workspace makes everything better 💻✨",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096932/14_14_A_professional_photogr_b1aegb.jpg",
    },
  ],

  arjun01: [
    {
      caption: "The city looks different after dark 🌃✨",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790096998/15_15_A_cinematic_night_phot_q1kfdd.jpg",
    },
    {
      caption: "Adventure is waiting around every corner 🌍🎒",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790097117/16_16_A_realistic_travel_pho_rhmb7r.jpg",
    },
  ],

  kavya01: [
    {
      caption: "Good food is always a good idea 🍽️❤️",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790097150/17_17_A_beautiful_profession_ujrgoq.jpg",
    },
    {
      caption: "Clean setup, clear mind, productive day 💻✨",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790097261/18_18_A_realistic_Instagram-_ul7yjo.jpg",
    },
  ],

  simran01: [
    {
      caption: "Waterfalls, mountains and pure peace 🌿💧",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790097260/19_19_A_stunning_nature_phot_oomjcy.jpg",
    },
    {
      caption: "Friends, laughter and good memories ❤️✨",
      image:
        "https://res.cloudinary.com/dikfneyci/image/upload/v1790097259/20_20_A_realistic_Instagram__miw3u0.jpg",
    },
  ],
};

// ===============================
// COMMENTS
// ===============================

const commentsData = [
  "This looks amazing! 🔥",
  "Love this 😍",
  "Great post! 👏",
  "This is awesome ❤️",
  "Such a beautiful view! ✨",
  "Looks so peaceful 😌",
  "Amazing capture! 📸",
  "This is such a vibe 🔥",
  "Absolutely beautiful ❤️",
  "Nice one! 👏",
  "Loved this post 😍",
  "Great shot! 📸",
  "The view is incredible! 🏔️",
  "Coffee + coding forever ☕💻",
  "This looks delicious! 😋",
  "Beautiful moment ✨",
  "Need to visit this place! 🌍",
  "Such a cool setup 💻",
  "Nature at its best 🌿",
  "Keep posting! 🔥",
];

// ===============================
// SEED DATABASE
// ===============================

const seedDatabase = async () => {
  try {
    // ===============================
    // CONNECT DATABASE
    // ===============================

    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ Database connected");

    // ===============================
    // DELETE OLD DATA
    // ===============================

    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    console.log("🗑️ Old users, posts and comments deleted");

    // ===============================
    // CREATE USERS
    // ===============================

    const hashedUsers = await Promise.all(
      usersData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        return {
          username: user.username,
          email: user.email,
          password: hashedPassword,
          bio: user.bio,
        };
      }),
    );

    const createdUsers = await User.insertMany(hashedUsers);

    console.log(`${createdUsers.length} users created`);

    // ===============================
    // USER MAP
    // ===============================

    const userMap = {};

    createdUsers.forEach((user) => {
      userMap[user.username] = user;
    });

    // ===============================
    // FOLLOW RELATIONSHIPS
    // ===============================

    for (const username in followMap) {
      const currentUser = userMap[username];

      for (const followingUsername of followMap[username]) {
        const followingUser = userMap[followingUsername];

        currentUser.following.push(followingUser._id);
        followingUser.followers.push(currentUser._id);
      }
    }

    await Promise.all(createdUsers.map((user) => user.save()));

    console.log("🤝 Follow relationships created");

    // ===============================
    // CREATE POSTS
    // ===============================

    const posts = [];

    for (const username in postsData) {
      const user = userMap[username];

      for (const postData of postsData[username]) {
        posts.push({
          author: user._id,
          image: postData.image,
          caption: postData.caption,
          likes: [],
        });
      }
    }

    const createdPosts = await Post.insertMany(posts);

    console.log(`${createdPosts.length} posts created`);

    // ===============================
    // CREATE COMMENTS
    // ===============================

    const comments = [];

    createdPosts.forEach((post, postIndex) => {
      // 2 comments per post

      const commenter1 = createdUsers[(postIndex + 1) % createdUsers.length];

      const commenter2 = createdUsers[(postIndex + 2) % createdUsers.length];

      comments.push({
        author: commenter1._id,
        post: post._id,
        text: commentsData[postIndex % commentsData.length],
      });

      comments.push({
        author: commenter2._id,
        post: post._id,
        text: commentsData[(postIndex + 1) % commentsData.length],
      });
    });

    await Comment.insertMany(comments);

    console.log(`${comments.length} comments created`);

    // ===============================
    // SUCCESS
    // ===============================

    console.log("================================");
    console.log("🎉 Dummy data seeded successfully");
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);

    process.exit(1);
  }
};

seedDatabase();
