import { Router } from "express";
import { ifnotRoleADMIN } from "../authen/authMiddleware";
import {
  dashboardPerson,
  dashboardTypes,
  dashboardBarVillage,
  dashboardCircleVillage,
  insertedMap,
  dashboardMap,
} from "../controllers/dashboardController";

const router = Router();

router.get("/dashboardPerson", ifnotRoleADMIN, dashboardPerson);
router.get("/dashboardTypes", ifnotRoleADMIN, dashboardTypes);
router.get("/dashboardBarVillage", ifnotRoleADMIN, dashboardBarVillage);
router.get("/dashboardCircleVillage", ifnotRoleADMIN, dashboardCircleVillage);
router.get("/dashboardMap", ifnotRoleADMIN, dashboardMap);
router.post("/insertedMap", ifnotRoleADMIN, insertedMap);

export default router;
