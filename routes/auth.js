import validator from 'validator'

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

  console.log(req.body)

}