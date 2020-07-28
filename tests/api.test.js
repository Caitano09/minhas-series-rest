const request = require('supertest')
const app = require('../app')
const expect = require('chai').expect
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const mongo = 'mongodb://localhost/test-minhas-series-rest'

const User = require('../models/user')
const Serie = require('../models/serie')

describe('Testing RestAPI', () => {
    before('connecting to mongoDB', async () => {
        await mongoose.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
        await User.remove({})
        const user = new User({
            username: 'daniel',
            password: '1234',
            roles: ['restrito']
        })
        await user.save()

        await Serie.remove({})
        return true
    })
    it('should return error', done => {
        request(app)
            .get('/series')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(err).be.null
                expect(res.body.success).be.false
                done()
            })
    })
    it('should auth an user', done => {
        request(app)
            .post('/auth')
            .send({ username: 'daniel', password: '1234' })
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).be.true
                expect(res.body.token).be.string
                done()
            })
    })

    it('should not auth an user', done => {
        request(app)
            .post('/auth')
            .send({ username: 'daniel2', password: '1234' })
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).be.false
                expect(res.body.message).be.string
                done()
            })
    })
    describe('auth as restrito', () => {
        let token = ''
        before('get token', (done) => {
            request(app)
                .post('/auth')
                .send({ username: 'daniel', password: '1234' })
                .expect(200)
                .end((err, res) => {
                    token = res.body.token
                    done()
                })
        })
        it('should return no series', done=>{
            request(app)
                .get('/series')
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).empty
                    done()
                })
        })
        it('should create a new serie', done=>{
            request(app)
                .post('/series')
                .set('x-access-token', token)
                .send({ name: 'minhaserie', status: 'watching' })
                .expect(200)
                .end((err, res) => {
                    expect(res.body._id).be.string
                    done()
                })
        })
    })
})