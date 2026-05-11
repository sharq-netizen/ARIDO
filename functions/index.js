const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const {onDocumentCreated, onDocumentDeleted} = require("firebase-functions/firestore");

const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

// Add a new message to Firestore
exports.addMessage = onRequest(async (req, res) => {
  try {
    const {text, userId, userName} = req.body;

    if (!text || !userId) {
      return res.status(400).json({error: "Missing required fields: text, userId"});
    }

    const writeResult = await getFirestore()
        .collection("messages")
        .add({
          text: text,
          userId: userId,
          userName: userName || "Anonymous",
          timestamp: new Date(),
          read: false,
        });

    res.json({
      success: true,
      messageId: writeResult.id,
      message: "Message added successfully",
    });
  } catch (error) {
    logger.error("Error adding message:", error);
    res.status(500).json({error: error.message});
  }
});

// Create or update user profile
exports.createUserProfile = onRequest(async (req, res) => {
  try {
    const {userId, userName, userEmail, profilePicture} = req.body;

    if (!userId || !userName) {
      return res.status(400).json({error: "Missing required fields: userId, userName"});
    }

    await getFirestore()
        .collection("users")
        .doc(userId)
        .set({
          userId: userId,
          userName: userName,
          userEmail: userEmail || "",
          profilePicture: profilePicture || "",
          createdAt: new Date(),
          lastActive: new Date(),
        }, {merge: true});

    res.json({
      success: true,
      message: "User profile created successfully",
    });
  } catch (error) {
    logger.error("Error creating user profile:", error);
    res.status(500).json({error: error.message});
  }
});

// Log message as read
exports.markMessageAsRead = onRequest(async (req, res) => {
  try {
    const {messageId} = req.body;

    if (!messageId) {
      return res.status(400).json({error: "Missing required field: messageId"});
    }

    await getFirestore()
        .collection("messages")
        .doc(messageId)
        .update({read: true});

    res.json({success: true, message: "Message marked as read"});
  } catch (error) {
    logger.error("Error marking message as read:", error);
    res.status(500).json({error: error.message});
  }
});

// Delete a message
exports.deleteMessage = onRequest(async (req, res) => {
  try {
    const {messageId} = req.body;

    if (!messageId) {
      return res.status(400).json({error: "Missing required field: messageId"});
    }

    await getFirestore()
        .collection("messages")
        .doc(messageId)
        .delete();

    res.json({success: true, message: "Message deleted successfully"});
  } catch (error) {
    logger.error("Error deleting message:", error);
    res.status(500).json({error: error.message});
  }
});

// Listen for new messages and log them
exports.onNewMessage = onDocumentCreated("/messages/{documentId}", (event) => {
  const messageData = event.data.data();
  logger.log("New message created:", event.params.documentId, messageData);

  return Promise.resolve();
});

// Cleanup: Remove deleted messages from user's message count
exports.onMessageDeleted = onDocumentDeleted("/messages/{documentId}", (event) => {
  const messageData = event.data.data();
  logger.log("Message deleted:", event.params.documentId, messageData);

  return Promise.resolve();
});

// Get user's online status
exports.updateUserStatus = onRequest(async (req, res) => {
  try {
    const {userId, isOnline} = req.body;

    if (!userId) {
      return res.status(400).json({error: "Missing required field: userId"});
    }

    await getFirestore()
        .collection("users")
        .doc(userId)
        .update({
          isOnline: isOnline || true,
          lastActive: new Date(),
        });

    res.json({success: true, message: "User status updated"});
  } catch (error) {
    logger.error("Error updating user status:", error);
    res.status(500).json({error: error.message});
  }
});
