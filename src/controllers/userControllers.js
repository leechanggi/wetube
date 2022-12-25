import bcrypt from 'bcryptjs';

import UserModel from '../models/User';
import config from '../config.json';

let data = { ...config };

/** get - root */
const rootJoin = (req, res) => {
  res.render(data.rootJoin.renderPath, data.rootJoin);
};
const rootLogin = (req, res) => {
  res.render(data.rootLogin.renderPath, data.rootLogin);
};

/** get - user */
const userEdit = (req, res) => {
  res.render(data.userEdit.renderPath, data.userEdit);
};
const userRemove = (req, res) => {
  res.render(data.userRemove.renderPath, data.userRemove);
};
const userLogout = (req, res) => {
  res.render(data.userLogout.renderPath, data.userLogout);
};
const userWatch = (req, res) => {
  res.render(data.userWatch.renderPath, data.userWatch);
};

/** githubLogin */
const startGithubLogin = (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/authorize';
  const config = {
    client_id: 'c22b5f8397f38e2e8dc1',
    allow_signup: false,
    scope: 'read:user user:email',
  };
  const params = new URLSearchParams(config);
  const redirectUrl = `${baseUrl}?${params}`;
  return res.redirect(redirectUrl);
};

const finishGithubLogin = (req, res) => {
  res.render(data.rootLogin.renderPath, data.rootLogin);
};

/** POST - root */
const postRootJoin = async (req, res) => {
  const { username, email, password, password2, name, location } = req.body;
  if (password !== password2) {
    return res.status(400).render(data.rootJoin.renderPath, Object.assign({}, data.rootJoin, { errorMessage: 'Password confirmation does not match.' }));
  }
  const exists = await UserModel.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render(data.rootJoin.renderPath, Object.assign({}, data.rootJoin, { errorMessage: 'This username/email is already taken.' }));
  }
  try {
    await UserModel.create({
      username,
      email,
      password,
      name,
      location,
    });
    return res.redirect('/login');
  } catch (error) {
    return res.render(data.rootJoin.renderPath, Object.assign({}, ...data.rootJoin, { errMessage: error._message }));
  }
};

const postRootLogin = async (req, res) => {
  const { name, password } = req.body;
  const user = await UserModel.findOne({ name });
  if (!name) {
    return res.status(400).render(data.rootLogin.renderPath, Object.assign({}, data.rootLogin, { errorMessage: 'This name does not exists.' }));
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render(data.rootLogin.renderPath, Object.assign({}, data.rootLogin, { errorMessage: 'Wrong password' }));
  }

  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect('/');
};

export { rootJoin, rootLogin, userEdit, userRemove, userLogout, userWatch, startGithubLogin, finishGithubLogin, postRootJoin, postRootLogin };
