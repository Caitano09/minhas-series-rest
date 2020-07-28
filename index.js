const port = process.env.PORT || 3000
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'
const app = require('./app')

const User = require('./models/user')

const createInitialUsers = async() =>{
    const total = await User.count({})
    if(total === 0){
        const user = new User({
            username: 'daniel',
            password: '1234',
            roles: ['restrito', 'admin']
        })
        await user.save()
        const user2 = new User({
            username: 'restrito',
            password: '1234',
            roles: ['restrito']
        })
        await user2.save()

    }
}

mongoose
    .connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        createInitialUsers()
        app.listen(port, ()=>console.log('listening'))
    })
    .catch(e => console.log(e))


