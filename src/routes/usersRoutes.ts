import { Router } from "express";
import { ifnotLogin, ifnotRoleADMIN } from "../authen/authMiddleware";
import {
  createMaster,
  updateStatusMaster,
  allMaster,
  getProfile,
  editProfile,
  profileMasterByid,
  editProfileMe,
  getCaregiven,
  getUser,
  getCaregivenFromuser,
  getuserDataFromID,
  historyDataRecordsFromID,
  getusersBySSD,
  getcaregivenBySSD,
  dataCaregiven,
  getCaregivenFromId,
  getDataAdlFromId,
  getProfileMe,
  editCaregiven,
} from "../controllers/usersController";

const router = Router();

router.post("/createMaster", ifnotLogin, createMaster);
router.put("/updateStatusMaster/:id", ifnotLogin, updateStatusMaster);
router.get("/allMaster", ifnotLogin, allMaster);
router.get("/getProfile/:id", ifnotLogin, getProfile);
router.get("/getProfileMe", ifnotLogin, getProfileMe);
router.put("/editProfile/:id", ifnotLogin, editProfile);
router.get("/profileMasterByid/:id", ifnotLogin, profileMasterByid);
router.get("/getCaregiven", ifnotLogin, getCaregiven);
router.get("/getCaregivenFromuser/:id", ifnotLogin, getCaregivenFromuser);
router.get("/getCaregivenFromId/:id", ifnotLogin, getCaregivenFromId);
router.put("/editProfileMe", ifnotLogin, editProfileMe);
router.get("/getUser", ifnotLogin, getUser);
router.get("/getuserDataFromID/:id", ifnotLogin, getuserDataFromID);
router.get(
  "/historyDataRecordsFromID/:id",
  ifnotRoleADMIN,
  historyDataRecordsFromID
);
router.get("/getusersBySSD/:id?", ifnotRoleADMIN, getusersBySSD);
router.get("/getcaregivenBySSD/:id?", ifnotRoleADMIN, getcaregivenBySSD);
router.get("/dataCaregiven/:id", ifnotRoleADMIN, dataCaregiven);
router.get("/getDataAdlFromId/:id", ifnotRoleADMIN, getDataAdlFromId);
router.put("/editCaregiven/:id", ifnotRoleADMIN, editCaregiven);

export default router;
