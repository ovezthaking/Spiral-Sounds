import { getDBConnection } from '../db/db.js'

export async function getGenres(req, res) {

  try {

    const db = await getDBConnection()

    const query = 'SELECT DISTINCT genre FROM products'
    
    let genres = await db.all(query)

    genres = genres.map(g => g.genre)

    res.json(genres)
    
  } catch (err) {

    console.error(err)
    res.status(500).json({error: 'Failed to fetch genres'})
  } finally {

    db.close()

  }

  
}

export async function getProducts(req, res) {

  try {

    const db = await getDBConnection()

    let query = 'SELECT * FROM products'

    const products = await db.all(query)
    
    res.json(products)
    
  } catch (err) {

    console.error(err)
    res.status(500).json({error: 'Failed to fetch products'})
  } finally{

    db.close()

  }

}