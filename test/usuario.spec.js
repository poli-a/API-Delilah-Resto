const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../index');

describe('#usuariosRoutes.js', function(){

    describe('/usuarios/registro', function() {
        it('Debería devolver el status code "400" y mensaje de fallo de registro cuando falte un campo obligatorio en body de request', function(done) {
            
            const body = {
                "username": "ralarcon",
                "nombreApellido": "Raul Alarcon",
                "email": "raal@mail.com",
                "password": "123456"
            }

            request(app)
                .post('/usuarios/registro')
                .send(body)
                .end(function(err, res){
                    expect(res.statusCode).to.equal(400);
                    expect(res.body.message).to.be.a('string');
                    done();
                })
        })

        it('Debería devolver el status code "400" y mensaje informando que el "email" enviado por body ya se encuentre registrado', function(done) {

            const body = {
                "username": "ralarcon",
                "nombreApellido": "Raul Alarcon",
                "email": "root@mail.com",
                "password": "123456",
                "telefono": 15545352,
                "direccion": "av. peron 11"
            }

            request(app)
                .post('/usuarios/registro')
                .send(body)
                .end(function(err, res){
                    expect(res.statusCode).to.equal(400);
                    expect(res.body.message).to.be.a('string');
                    done();
                })
        })

        it('Debería devolver el status code "201" y mensaje de confirmacion de registro de Usuario', function(done) {

            const body = {
                "username": "ralarcon",
                "nombreApellido": "Raul Alarcon",
                "email": "raal@mail.com",
                "password": "123456",
                "telefono": 15545352,
                "direccion": "av. peron 11"
            }

            request(app)
                .post('/usuarios/registro')
                .send(body)
                .end(function(err, res){
                    expect(res.statusCode).to.equal(201);
                    expect(res.body.message).to.be.a('string');
                    done();
                })
        })
    })
})
