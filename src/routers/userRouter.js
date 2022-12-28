import express from 'express';
import {
  userEdit,
  userEditPassword,
  userRemove,
  userLogout,
  userWatch,
  startGithubLogin,
  finishGithubLogin,
  postUserEdit,
  postUserEditPassword,
} from '../controllers/userControllers';
import { protectorMiddleware, publicOnlyMiddleware, multerMiddleware } from '../middlewares';

const userRouter = express.Router();

userRouter.get('/logout', protectorMiddleware, userLogout);
userRouter.route('/edit').all(protectorMiddleware).get(userEdit).post(multerMiddleware.single('avatar'), postUserEdit);
userRouter.route('/editpassword').all(protectorMiddleware).get(userEditPassword).post(postUserEditPassword);
userRouter.get('/remove', userRemove);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);
userRouter.get('/:id', userWatch);

export default userRouter;
