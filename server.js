require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

const MOVIES = require('./movies.json')
const app = require('../express-boilerplate/src/app')

app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())


app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    next()
})


app.get('/movies', function handleGetMovies(req, res) {
    let response = MOVIES
    if (req.query.genre) {
        response = response.filter(movie => {
            return movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        })
    }

    if (req.query.country) {
        response = response.filter(movie => {
            return movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        })
    }

    if (req.query.avg_vote) {
        response = response.filter(movie => {
            return Number(movie.avg_vote) >= Number(req.query.avg_vote)
        })
    }
    res.json(response)
})

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = {error: {message: 'Server error'}}
    }else {
        response = {error}
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is listening on https://localhost:${PORT}`)
})