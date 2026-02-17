import  express from "express"
import { deleteUser, getUserById, loginUser, registerUser, updateUser } from "../controllers/User.controller.js";
const UserRouter = express.Router();


UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);


UserRouter.get("/:id", getUserById);
UserRouter.put("/:id", updateUser);
UserRouter.delete("/:id", deleteUser);

export default  UserRouter;
