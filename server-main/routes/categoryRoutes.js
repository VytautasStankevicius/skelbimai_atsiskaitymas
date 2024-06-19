const express = require("express");
const router = express.Router();
const { createCategory, getAllCategories, deleteCategory } = require("../controllers/categoryController");
const protectAdmin = require("../middleware/adminAuthMiddleware");

// Kuriam kateogorija
router.post("/", protectAdmin, createCategory);
// Gaunam visas kateogorijas
router.get("/", getAllCategories);
// Trinam kategorija
router.delete("/:id", protectAdmin, deleteCategory);

module.exports = router;
