// index.js
const express = require('express')
const router = express.Router()
const path = require('path')
const url = require('url')
const cors = require('cors')
const { response } = require('express')
const config = require('config')
const testRouter = require('./routes/test').router
const logger = require('./logger/my_logger')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const port = config.express.port;
const test_repo = require('./dal/test_repo')
const { nextTick } = require('process')
logger.info('test1')
const app = express()

// to use body parameters
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use(express.static(path.join('.', '/static/'))) // /static/index.html

// ejs
app.set('view engine', 'ejs')

app.get('/my_ejs', async (req, res) => res.render('my_ejs', {
  employees : await test_repo.get_all_test()
}))

//middle ware
app.get('*', async (req, res, next) => {
  logger.debug(`the url log is =>  ${req.url}`)
  next()
})


app.listen(port, () => {
  console.log(`Listening to port ${port}`);
})

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:8080/",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.use('/test', testRouter)

logger.debug('this is a debug message')


