import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'

import mongoose from 'mongoose'

import router from './router'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compression())
app.use(cors({ origin: true, credentials: true }))

app.use('/', router())

const server = http.createServer(app)

server.listen(8080, () => {
  console.log('Server listening on port 8080')
})

const MONGO_URL =
  'mongodb+srv://nugrahaadi733:nugrahaadi733@cluster0.thwdwmw.mongodb.net/?retryWrites=true&w=majority'

mongoose.Promise = Promise
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', (error: Error) => {
  console.log(error)
})
