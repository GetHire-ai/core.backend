const express = require("express");
const router = express.Router();
const { StudentverifyToken } = require("../Middleware/VerifyToken");
const {
  getNotificationStd,
  deleteNotification,
} = require("../Controllers/NotificationController");

router.get("/", StudentverifyToken, getNotificationStd);
router.get("/delete/:id", deleteNotification);

module.exports = router;
