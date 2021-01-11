require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

const MOVIES = require('./movies.json')

console.log(process.env.API_TOKEN)
app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())


app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    console.log('validate bearer')

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

const PORT = 8000
app.listen(PORT, () => {
    console.log(`Server is listening on https://localhost:${PORT}`)
})