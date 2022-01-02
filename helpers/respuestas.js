// Repuesta que recibe por parametro un mensaje de error y retorna un response con codigo de error 400 //
const error400 = (res, msj) => {
    return res.status(400).json({'message': msj});
}

// Repuesta que recibe por parametro un mensaje de error y retorna un response con codigo de error 201 //
const created201 = (res, msj) => {
    return res.status(201).json({'message': msj});
}

// Repuesta que recibe por parametro un mensaje 'ok' y retorna un response con codigo de error 200  y datos//
const ok200 = (res, msj, data) => {
    return res.status(200).json({'message': msj, 'data': data});
}

// Repuesta que recibe por parametro un mensaje de error y retorna un response con codigo de error 404 //
const error404 = (res, msj) => {
    return res.status(404).json({'message': msj});
}

module.exports = { error400, created201, ok200, error404 }