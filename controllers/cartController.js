import { getDBConnection } from "../db/db.js";

export async function addToCart(req, res) {

    const product_id = parseInt(req.body.productId, 10)

    if (isNaN(product_id)){
        return res.status(400).json({ error: 'Invalid product ID'})
    }

    if (!req.session.userId){
        return res.status(400).json({error: 'User not logged in'})
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

    if (!req.session.userId){
        return res.status(400).json({error: 'User not logged in'})
    }

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