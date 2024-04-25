const generateError = (message, httpCode) => {
    const error = new Error(message);
    error.httpCode = httpCode;
    return error;
};

module.exports = generateError;

