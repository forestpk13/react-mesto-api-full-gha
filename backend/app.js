const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const limiter = require('express-rate-limit');

const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/errorHandler');
const { login, createUser, logout } = require('./controllers/users');
const NotFoundError = require('./errors/notFounderror');
const auth = require('./middlewares/auth');
const { validateLoginData, validateRegisterData } = require('./utils/validators/userValidators');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(cookieParser());
app.use(limiter({
  windowMs: 10 * 60 * 1000,
  max: 100,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use(requestLogger); // Логгер запросов
app.use(cors);

app.post('/signin', validateLoginData, login);
app.post('/signup', validateRegisterData, createUser);

app.use(auth); // ниже защищенные роуты

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.get('/signout', logout);

app.use('*', () => {
  throw new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса');
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at port ${PORT}`);
});
