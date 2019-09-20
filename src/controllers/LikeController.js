const Dev = require('../models/Dev');

module.exports = {
    async index(req, res) {
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        const likes = await Dev.find({ _id:  loggedDev.likes });

        return res.json(likes);
    },

    async store(req, res) {
        //console.log(req.io, req.connectedUsers);

        const { user } = req.headers;
        const { devId } = req.params;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({ error: 'Dev not exists' });
        }

        if (targetDev.likes.includes(loggedDev._id)) {
            loggedDev.match.push(targetDev._id);
            targetDev.match.push(loggedDev._id);
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if (loggedSocket) {
                req.io.to(loggedSocket).emit('match', targetDev);
            }

            if (targetSocket) {
                req.io.to(targetSocket).emit('match', loggedDev);
            }
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();
        await targetDev.save();

        return res.json(loggedDev);
    },

    async delete(req, res) {
        const { user } = req.headers;
        const { devId } = req.params;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        let match = loggedDev.match.indexOf(devId);
        if (match !== -1) {
            loggedDev.match.splice(match,1);

            match = targetDev.match.indexOf(user);
            targetDev.match.splice(match,1);
            await targetDev.save();
        }

        let index = loggedDev.likes.indexOf(devId);
        loggedDev.likes.splice(index,1);

        await loggedDev.save();

        return res.json(loggedDev.likes);
    },
};