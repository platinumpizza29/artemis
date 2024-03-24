const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//get all users
router.get("/allusers", async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany()
    if (allUsers > 0) {
      res.status(200).json({
        users: allUsers
      })
    } else {
      res.status(400).json({
        message: "No Users"
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    })
  }
})

//login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
      password: password,
    },
  });
  if (!user) {
    res.status(401).json({
      message: "Invalid credentials",
    });
  } else {
    res.json({
      message: "Logged in successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  }
});

//register user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: password,
    },
  });
  res.json({
    message: "Registered successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

module.exports = router;
