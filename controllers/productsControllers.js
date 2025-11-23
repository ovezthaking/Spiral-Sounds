import { getDBConnection } from '../db/db.js'

export async function getGenres(req, res) {

  try {

    const db = await getDBConnection()

    const query = 'SELECT DISTINCT genre FROM products'
    
    let genres = await db.all(query)

    genres = genres.map(g => g.genre)

    res.json(genres)

  } catch (err) {

    res.status(500).json({error: 'Failed to fetch genres', details: err.message})

  }

}

export async function getProducts() {

  console.log('products')

}