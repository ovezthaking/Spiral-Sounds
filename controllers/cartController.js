import { getDBConnection } from "../db/db.js";

export async function addToCart(req, res) {

    const product_id = parseInt(req.body.productId, 10)

    if (isNaN(product_id)){
        return res.status(400).json({ error: 'Invalid product ID'})
    }

    try {
        const db = await getDBConnection()
        
        const user_id = req.session.userId

        const params = [user_id, product_id]

        const existing = await db.get(
            'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?'
            ,params
        )

        let query

        if(existing){
            query = 'UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?'
            await db.run(query, existing.id)
        } else{
            query = `INSERT INTO cart_items (user_id, product_id, quantity)
            VALUES (?, ?, 1)`
            await db.run(query, params)
        }
        
        res.status(201).json({message: 'Added to cart'})
    } catch (err) {
        console.error('Error adding to cart: ', err)
        res.status(400).json({error: 'Failed to add to cart'})
    }
}


export async function getCartCount(req, res) {

    try {
        const db = await getDBConnection()

        const query = `SELECT SUM(quantity) AS totalQuantity
                        FROM cart_items
                        WHERE user_id = ?`
        const result = await db.get(query, req.session.userId)

        res.json({totalItems: result.totalQuantity || 0})   //totalItems bcs Frontend requires it
    } catch (err) {
        console.error('Error reading a cart count: ', err)
        res.status(400).json({error: 'Failed to read a cart count'})
    }
}


export async function getAll(req, res) {

  try {

    const db = await getDBConnection()

    const items = await db.all(`SELECT ci.id AS cartItemId, ci.quantity, p.title,
         p.artist, p.price FROM cart_items ci JOIN products p ON p.id = ci.product_id 
         WHERE ci.user_id = ?`, req.session.userId)

    res.json({items: items})

  } catch (err) {
        console.error('Error reading a cart content: ', err)
        res.status(400).json({error: 'Failed to read a cart content'})
  }
}


export async function deleteItem(req, res) {

    const userId = req.session.userId
    const itemId = parseInt(req.params.itemId, 10)

    if (isNaN(itemId)){
        return res.status(400).json({ error: 'Invalid item ID'})
    }

    try {
        
        const db = await getDBConnection()
        
        const item = await db.get(`SELECT * FROM cart_items WHERE user_id = ? AND
            id = ?`, [userId, itemId])

        if(!item){
            return res.status(400).json({error: 'Item not found'})
        }

        const query = 'DELETE FROM cart_items WHERE user_id = ? AND id = ?'

        await db.run(query, [userId, itemId])
        res.status(204).send()

    } catch (err) {
        console.error('Error deleting an item: ', err)
        res.status(400).json({error: 'Failed to delete an item'})
    }
}


export async function deleteAll(req, res) {

    const userId = req.session.userId

    try {
        
        const db = await getDBConnection()
        
        const items = await db.get(`SELECT * FROM cart_items WHERE user_id = ?`, userId)

        if(!items){
            return res.status(400).json({error: 'Items not found'})
        }

        const query = 'DELETE FROM cart_items WHERE user_id = ?'

        await db.run(query, userId)
        res.status(204).send()

    } catch (err) {
        console.error('Error deleting items: ', err)
        res.status(400).json({error: 'Failed to delete items'})
    }
}
