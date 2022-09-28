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
    },

    // Get the user name and password from the middleware
    userDetails: (req, res, next) => {
        const user = req.user;

        try {
            return res.status(200).json({
                status: false,
                message: 'success',
                data: {
                    name: user.name,
                    email: user.email
                }
            });
        } catch (err) {
            next(err);
        }
    },

    updatePassword: async (req, res, next) => {
        const user = req.user;

        try {
            const { old_password, new_password } = req.body;
            const email = user.email;
            const { data }  = await api.put('/update-password', {email, old_password, new_password }); // destruct the data for getting the status and data from the url

            const updatedData = data.data

            return res.status(201).json({
                status: true,
                message: 'success update password on user',
                data: {
                    name: user.name,
                    email: user.email
                }
            });

        } catch (err) {
            next(err);
        }
    },

    deleteUser: async (req, res, next) => {
        const user = req.user;

        try {
            const email = user.email;
            const { data }  = await api.put('/delete', {email}); // destruct the data for getting the status and data from the url

            const deleted = data.data

            return res.status(201).json({
                status: true,
                message: 'success deactivate user',
                data: deleted
            });
        } catch (err) {
            next(err);
        }
    }
}
