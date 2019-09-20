const Dev = require('../models/Dev');

module.exports = {
    async index(req, res) {
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        const match = await Dev.find({ _id: loggedDev.match });

        return res.json(match);
    },
}