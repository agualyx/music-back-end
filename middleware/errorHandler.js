const { STATUS_CODE } = require('../constant')

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch(statusCode){
        case STATUS_CODE.VALIDATION_ERROR:
            res.json({
                title:'validaction error',
                message: err.message,
                stackTrace: err.stack
            });
            break;
        case STATUS_CODE.UNAUTHORIZED:
            res.json({
                title:'unauthorized',
                message: err.message,
                stackTrace: err.stack
            });
            break;
        case STATUS_CODE.FORBIDDEN:
            res.json({
                title:'forbidden',
                message: err.message,
                stackTrace: err.stack
            });
            break;
        case STATUS_CODE.NOT_FOUND:
            res.json({
                title:'not found',
                message: err.message,
                stackTrace: err.stack
            })
            break;
        case STATUS_CODE.SERVER_ERROR:
            res.json({
                title: 'server error',
                message: err.message,
                stackTrace: err.stack
            });
            break;
        default:
            console.log('Well! Nothing wrong!');
    }
}

module.exports = {
    errorHandler
}