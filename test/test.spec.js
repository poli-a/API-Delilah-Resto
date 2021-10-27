const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../index');

describe('#principalRoutes.js', function(){
    describe('Home "/"', function() {
        it('Debería devolver el status code "200" y msj de bienvenida', function(done) {
            request(app)
                .get('/')
                .end( function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.message).to.be.a('string');
                    done();
                })
        })
    })
})