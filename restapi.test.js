const assert = require('assert')
const expect = require('chai').expect
const axios = require('axios')
const config = require('config')

const port = config.express.port;

describe('Testing rest-api resource tests' ,() => {

    it('testing rest-api get that should return status 200', async () => {
        const res = await axios.get(`http://localhost:${port}/test`);
        expect(res.status).to.equal(200)
    }),

    it('testing rest-api get by id', async () => {
        const res = await axios.get(`http://localhost:${port}/test/22`);
        console.log(res.data);
        expect(res.data.id).to.equal(22)
        expect(res.status).to.equal(200)

    })
})