import validator from 'validator'
import { getDBConnection } from '../db/db.js';
import bcrypt from 'bcryptjs'
import session from 'express-session';


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

    const hashed = await bcrypt.hash(password, 10)

    const result = await db.run(`INSERT INTO users (name, email, username, password)
        VALUES (?, ?, ?, ?)`,
        [ name, email, username, hashed ]
    )

    console.log(result)

    req.session.userId = result.lastID
   

    await db.exec('COMMIT')
    res.status(201).json({message: `User ${username} registered`})

  } catch (err) {
    
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' })
  }

}


export async function loginUser(req, res) {

  let { username, password } = req.body

  if (!username || !password){
    return res.status(400).json({error: 'All fields are required'})
  }

  username = username.trim()

  try {
    const db = await getDBConnection()

    const query = 'SELECT id, username, password FROM users WHERE username = ?'

    const user = await db.get(query, username)

    if (!user || !await bcrypt.compare(password, user.password)){
      return res.status(401).json({error: 'Invalid credentials'})
    }

    req.session.userId = user.id
    res.status(200).json({message: 'Logged in'})

  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ error: 'Login failed. Please try again.' })
  }
}

/*
Challenge:
1. Create a function which logs out the user. 
- You can use the .destroy() method directly on the session.
- .destroy() takes a callback function which you can use to send a confirmation response with this JSON:
  { message: 'Logged out' }

You will need to write code here and in one other place!

Test with:
username: test
password: test
*/

export async function logoutUser(req, res) {
  req.session.destroy( () => {
    res.json({ message: 'Logged out' })
  })
}