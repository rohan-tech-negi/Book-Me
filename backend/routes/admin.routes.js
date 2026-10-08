import express from "express";
import { loginAdmin , getAdminDashboard, updateWithdrawalStatus} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

router.post("/login", loginAdmin);
router.get('/dashboard', adminAuth, getAdminDashboard)
router.patch('/withdrawls/:id', adminAuth, updateWithdrawalStatus)

export default router;
