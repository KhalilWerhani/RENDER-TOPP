import express from 'express'
import { adminUpdateUser, getCurrentUser, getUserData , getUserStats   } from '../controllers/userController.js';
import  userAuth, { verifyAdmin }  from '../middleware/userAuth.js'
import { updateProfile } from "../controllers/userController.js";
import { deleteUser } from '../controllers/userController.js';
import { getAllUsers } from '../controllers/userController.js';
import { getExpertInfo } from '../controllers/userController.js';
import { getUserById } from "../controllers/userController.js";
import { getUserDossiers } from '../controllers/userController.js';
import { getDossierFiles } from '../controllers/userController.js';


const userRouter = express.Router();

/*getUserStats*/



userRouter.get('/data' , userAuth , getUserData); 
userRouter.put('/profil', userAuth , updateProfile);
userRouter.delete('/delete/:userId', userAuth, deleteUser);
userRouter.get('/all', userAuth, getAllUsers);

userRouter.get('/stats',userAuth , getUserStats);

userRouter.get('/stats', getUserStats);
userRouter.get("/get-by-id/:id", getUserById); // ✅ /api/user/get-by-id/:id


userRouter.get('/currentUser/:userId', userAuth, getCurrentUser);
userRouter.put('/update/:userId',userAuth, verifyAdmin, adminUpdateUser);
userRouter.get('/expert', userAuth ,getExpertInfo);
userRouter.get('/dossiers', userAuth, getUserDossiers);
userRouter.get('/dossiers/:id/files', userAuth, getDossierFiles);


// Example Express route


export default userRouter ;