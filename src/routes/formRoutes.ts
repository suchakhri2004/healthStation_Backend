import { Router } from "express";
import { ifnotLogin, ifnotRoleADMIN } from "../authen/authMiddleware";
import {
  healthDataForm,
  adl_Form,
  careGiven_form,
  healthDataRecords,
  userPersonal,
} from "../controllers/formController";

const router = Router();

router.post("/healthDataForm", ifnotLogin, healthDataForm);
router.post("/adl_Form", ifnotLogin, adl_Form);
router.post("/careGiven_form", ifnotLogin, careGiven_form);
router.post("/healthDataRecords", ifnotLogin, healthDataRecords);
router.post("/userPersonal", ifnotLogin, userPersonal);

export default router;
