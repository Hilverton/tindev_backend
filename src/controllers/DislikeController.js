const Dev = require('../models/Dev');

module.exports = {
    async index(req, res) {
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        const dislikes = await Dev.find({ _id: loggedDev.dislikes });

        return res.json(dislikes);
    },

    async store(req, res) {
        const { user } = req.headers;
        const { devId } = req.params;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({ error: 'Dev not exists' });
        }

        loggedDev.dislikes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev);
    },

    async delete(req, res) {
        const { user } = req.headers;
        const { devId } = req.params;

        const loggedDev = await Dev.findById(user);

        let index = loggedDev.dislikes.indexOf(devId);
        loggedDev.dislikes.splice(index,1);

        await loggedDev.save();

        return res.json(loggedDev.dislikes);
    },
};