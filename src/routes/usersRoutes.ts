import { Router } from 'express';
import { ifnotLogin,ifnotRoleADMIN } from '../authen/authMiddleware';
import { createMaster,updateStatusMaster,allMaster,getProfile,editProfile,profileMasterByid,editProfileMe,getCaregiven,getUser,getCaregivenFromuser,getuserDataFromID,historyDataRecordsFromID,getusersBySSD,getcaregivenBySSD,dataCaregiven,getCaregivenFromId } from '../controllers/usersController';

const router = Router();

router.post('/createMaster',ifnotRoleADMIN, createMaster);
router.put('/updateStatusMaster/:id',ifnotRoleADMIN, updateStatusMaster);
router.get('/allMaster',ifnotRoleADMIN, allMaster);
router.get('/getProfile/:id',ifnotRoleADMIN, getProfile);
router.put('/editProfile/:id',ifnotRoleADMIN, editProfile);
router.get('/profileMasterByid/:id',ifnotLogin, profileMasterByid);
router.get('/getCaregiven',ifnotRoleADMIN, getCaregiven);
router.get('/getCaregivenFromuser/:id',ifnotRoleADMIN, getCaregivenFromuser);
router.get('/getCaregivenFromId/:id',ifnotRoleADMIN, getCaregivenFromId);
router.put('/editProfileMe',ifnotLogin, editProfileMe);
router.get('/getUser',ifnotRoleADMIN, getUser);
router.get('/getuserDataFromID/:id',ifnotRoleADMIN, getuserDataFromID);
router.get('/historyDataRecordsFromID/:id',ifnotRoleADMIN, historyDataRecordsFromID);
router.get('/getusersBySSD/:id',ifnotRoleADMIN, getusersBySSD);
router.get('/getcaregivenBySSD/:id',ifnotRoleADMIN, getcaregivenBySSD);
router.get('/dataCaregiven/:id',ifnotRoleADMIN, dataCaregiven);





export default router;
