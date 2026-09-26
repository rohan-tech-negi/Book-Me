import express from "express"

import { createServices, updateService, deleteService, listServices } from "../controllers/serviceController.js"


import auth from '../middleware/auth.js'

const router = express.Router

router.get("/",auth, listServices)
router.get("/",auth, createServices)
router.get("/:id",auth, updateService)
router.get("/:id",auth, deleteService)

export default router