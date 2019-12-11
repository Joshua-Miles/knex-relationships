const databaseSettings = require('./knexfile.js').development
const knex = require('knex')(databaseSettings)

async function seed(){

    await knex('directors').insert([
        {
            firstName: "Anthony",
            lastName: "Russo"
        },
        {
            firstName: "Quentin",
            lastName: "Tarrantino"
        }, 
        {
            firstName: "George",
            lastName: "Lucas"
        }
    ])

    await knex('movies').insert([
        {
            name: 'Avengers Endgame',
            director_id: 1
        },
        {
            name: 'Batman',
            director_id: 2
        },
        {
            name: 'Star Wars: Return of the Jedi',
            director_id: 3
        }
    ])
}

class Base {
    constructor(movie){
        // this = { ...this, ...movie }
        Object.assign(this, movie)
    }

    static get tableName(){
        return this.constructor.name.toLowerCase()
    }

    static belongsTo(association){
        this.prototype[association] = async function(){
            let [ thingy ] = await knex(association+'s').where({ id: this[`${association}_id`] })
            return thingy
        }
    }

    static hasMany(association){
        this.prototype[association] = async function(){
            let [ thingy ] = await knex(association).where({ [`${this.tableName}_id`]: this.id })
            return thingy
        }
    }

    static async find(id){
        let [ movie ] = await knex(this.name.toLowerCase()+'s').where({ id: id })
        return new this(movie)
    }

}


class Movie extends Base {


}

class Director extends Base {


}
Director.hasMany('movies')
Movie.belongsTo('director')


const express = require('express')
const app = express()

app.get('/movies/:id', async (req, res) => {
    let movie = await Movie.find(req.params.id)
    let director = await movie.director()
    res.json({ ...movie, director })
})

app.get('/directors/:id', async (req, res) => {
    let director = await Director.find(req.params.id)
    let movies = await director.movies()
    res.json({...director, movies })
})

app.listen(8080)