const adapter = require('../external/api-adapter') 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {
    USER_SERVICE_HOST,
    JWT_SIGNATURE_KEY
} = process.env;

const api = adapter(USER_SERVICE_HOST);

module.exports = {
    register: async(req, res, next) => {
        try {
            // check email
            const { name, email, password } = req.body;
            const { data }  = await api.post('/create', {name, email, password }); // destruct the data for getting the status and data from the url

            const registeredData = data.data

            return res.status(201).json({
                status: true,
                message: 'success',
                data: registeredData
            });
        } catch(err) {
            // check the connection
            if (err.code == 'ECONNREFUSED') {
                err = new Error('service unavaiable'); // buat error terlebih dahulu lalu dilempar dengan next(err)
                return next(err)
            }

            if (err.response) {
                const { status, data } = err.response;
                res.status(status).json(data);
            }

            next(err);
        }
    },

    login: async(req, res, next) => {
        try {
            // check email
            const { email, password } = req.body;

            // destruct the data for getting the status and data from the url
            const { data }  = await api.post('/find-user', { email, password }); 

            console.log(data)

            const userData = data.data

            console.log(userData);

            const user = data.data;
            const valid = await bcrypt.compare(password, user.password);

            // check is the password is valid or not
            if (!valid) {
                return res.status(400).json({
                    status: false,
                    message: 'wrong password!',
                    data: null
                });
            }

            // create the token for user
            const token = jwt.sign(user, JWT_SIGNATURE_KEY);

            return res.status(200).json({
                status: true,
                message: "User Successfully Login",
                data: { token }
            });
        } catch(err) {
            console.log(err)
            // check the connection
            if (err.code == 'ECONNREFUSED') {
                err = new Error('service unavaiable'); // buat error terlebih dahulu lalu dilempar dengan next(err)
                return next(err)
                // throw new Error('service unavailable');
            }
            // handle error dari service lain
            if (err.response) {
                const { status, data } = err.response;
                res.status(status).json(data);
            }
            next(err);
        }
    }
}