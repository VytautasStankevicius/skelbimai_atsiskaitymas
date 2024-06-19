const express = require("express");
const router = express.Router();
const {
  createAd,
  deleteAd,
  updateAd,
  getAllAds,
  getUserAds,
  likeAd,
  getLikedAds,
} = require("../controllers/adController");
const { protect } = require("../middleware/authMiddleware");
const protectAdmin = require("../middleware/adminAuthMiddleware");

// Naujam skelbimui
router.post("/", protect, createAd);

// Triam skelbima
router.delete("/:id", protect, deleteAd);

// Atnaujiman skelbima
router.put("/:id", protect, updateAd);

// Gaunam visus skelbimus
router.get("/", getAllAds);

// Gaunam dabartinio vartotojo skelbimus
router.get("/my", protect, getUserAds);

// Laikinam skelbima
router.post("/:id/like", protect, likeAd);

// Gaunam visus vartotojo laikintus skelbimus
router.get("/liked", protect, getLikedAds);

module.exports = router;
