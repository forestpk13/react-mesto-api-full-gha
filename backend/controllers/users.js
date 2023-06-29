/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFounderror');
const Utils = require('../utils/utils');

const { NODE_ENV } = process.env;

const createTokenById = (id) => {
  const secretKey = Utils.getJWTSecretKey();
  return jwt.sign({ _id: id }, secretKey, { expiresIn: '7d' });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      const token = createTokenById(user._id);
      if (NODE_ENV === 'production') {
        res
          .cookie('token', token, {
            maxAge: 604800000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          })
          .status(201)
          .send(user);
      } else {
        return res
          .cookie('token', token, {
            maxAge: 604800000,
            httpOnly: true,
            sameSite: true,
          })
          .status(201)
          .send(user);
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUser(email, password)
    .then((user) => {
      const token = createTokenById(user._id);
      if (NODE_ENV === 'production') {
        res
          .cookie('token', token, {
            maxAge: 604800000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          })
          .status(201)
          .send(user);
      } else {
        return res
          .cookie('token', token, {
            maxAge: 604800000,
            httpOnly: true,
            sameSite: true,
          })
          .status(201)
          .send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.logout = (_, res) => res.clearCookie('token', { secure: true, sameSite: 'none' }).send({ message: 'Вы вышли из профиля' });

const updateUser = (req, res, next, userData) => {
  User.findByIdAndUpdate(
    req.user._id,
    userData,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const userData = {
    name: req.body.name,
    about: req.body.about,
  };
  updateUser(req, res, next, userData);
};

module.exports.updateUserAvatar = (req, res, next) => {
  updateUser(req, res, next, { avatar: req.body.avatar });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь с таким id не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный формат id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.getOwnProfile = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send(user))
    .catch(next);
};
