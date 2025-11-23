import validator from 'validator'
import { getDBConnection } from '../db/db.js';
import bcrypt from 'bcryptjs'


export async function registerUser(req, res) {

  let { name, email, username, password } = req.body

  if (!name || !email || !username || !password){
    return res.status(400).json({error: 'All the fields are required'});
  }

  name = name.trim()
  email = email.trim()
  username = username.trim()

  if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)){
    return res.status(400).json({error: 'username must be 1-20 characters, using letters, numbers, _ or -.'})
  }

  if (!validator.isEmail(email)){
    return res.status(400).json({error: 'Bad format of email'})
  }

  //console.log(req.body)


  try {
    
    const db = await getDBConnection()

    let query = 'SELECT username FROM users WHERE username = ? OR email = ?' 
    let params = [username, email]

    const dbCheck = await db.get(query, params)

    if (dbCheck){
        return res.status(400).json({error: 'Username or an E-mail already in use'})
    }

    await db.exec('BEGIN TRANSACTION')

    hashed = await bcrypt.hash(password, 10)

    await db.run(`INSERT INTO users (name, email, username, password)
        VALUES (?, ?, ?, ?)`,
        [ name, email, username, hashed ]
    )
   

    await db.exec('COMMIT')
    res.status(201).json({message: `User ${username} registered`})

  } catch (err) {
    
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' })
  }

}