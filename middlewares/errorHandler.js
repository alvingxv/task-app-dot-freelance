const handleErrors = (err, req, res, next) => {
    return res.status(err.status || 500).send({ status: err.status, success: false, message: err.message });
}
module.exports = handleErrors;