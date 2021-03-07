require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const { readdirSync } = require('fs');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));
app.use(cors());

mongoose.connect(process.env.DATABASE_URI, {
  useUnifiedTopology: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useCreateIndex: true,
});

readdirSync(path.join(__dirname, './routes')).map((route) =>
  app.use('/api', require(`./routes/${route}`))
);

const PORT = 8000 || process.env.PORT;
app.listen(PORT, () => console.log(`App listening at port ${PORT}`)); // eslint-disable-line
