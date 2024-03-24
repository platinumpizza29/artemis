const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("chat-history", async (req, res) => {
  const { userId, otherUserId } = req.body;
  try {
    const allChat = await prisma.message.findMany({
      where: {
        id: userId,
        receiverId: otherUserId,
      },
    });
    if (allChat.length > 0) {
      res.status(200).json({
        chats: allChat,
      });
    } else {
      res.status(400).json({
        message: "No conversation yet",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
