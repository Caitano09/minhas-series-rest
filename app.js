const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const jwtSecret = 'abc123'
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./swagger.yaml')
const bodyParser = require('body-parser')

const User = require('./models/user')
const series = require('./routes/series')
const users = require('./routes/users')

app.use(cors({
    origin: (origin, callback)=>{
        //if(origin === 'http://server2:8080'){
            callback(null, true)
        //}else{
       //     callback(new Error('Not allowed by CORS'))
       // }
    }
}))
app.use(bodyParser.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.use('/series', series)
app.use('/users', users)


app.post('/auth', async(req, res)=>{
    const user = req.body
    const userDb = await User.findOne({username: user.username})
    if(userDb){
        if(userDb.password === user.password){
            const payload = {
                id: userDb._id,
                username: userDb.username,
                roles: userDb.roles
            }
            jwt.sign(payload, jwtSecret, (err, token)=>{
                res.send({
                    success: true,
                    token: token
                })
            })
            
        }else{
            res.send({
                success: false, 
                message: 'wrong credentials'
            })
        }
    }else{
    res.send({success: false, message: 'wrong credentials'}) 
    }
})

module.exports = app

