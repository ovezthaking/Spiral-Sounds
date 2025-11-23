import { getDBConnection } from '../db/db.js'

export async function getGenres(req, res) {
  const db = await getDBConnection()
  
  try {

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
  const db = await getDBConnection()

  try {

    let query = 'SELECT * FROM products'
    let params = []

    const { genre, search } = req.query

    if (genre) {
      query += ' WHERE genre = ?'
      params.push(genre)
    }

    if(genre && search){
      query += ' AND (title LIKE ? OR artist LIKE ? OR genre LIKE ?)'
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    } else if(!genre && search){
      query += ` WHERE (title LIKE ? OR artist LIKE ? OR genre LIKE ?)`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    const products = await db.all(query,params)
    
    res.json(products)
    
  } catch (err) {

    console.error(err)
    res.status(500).json({error: 'Failed to fetch products'})
  } finally{

    db.close()

  }

}