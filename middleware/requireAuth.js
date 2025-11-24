export default function requireAuth(req, res, next){

    if (!req.session.userId){
        console.log('Acces has been blocked')
        return res.status(401).json({error: 'Unauthorized'})
    }

    next()

}
