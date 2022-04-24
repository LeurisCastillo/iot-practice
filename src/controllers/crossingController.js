const mongoose = require('mongoose');

const Crossing = mongoose.model('crossing');

module.exports = {
    async index(req, res) {
        const { page = 1 } = req.query;
        const crossings = await Crossing.paginate({},{ page, limit: 10});
        return res.json(crossings);
    },
    async show(req, res){
        const crossing = await Crossing.findById(req.params.id);
        return res.json(crossing);
    },
    async create(req, res) {
        const crossing = await Crossing.create(req.body);
        return res.json(crossing);
    },
    async update(req, res){
        const crossing = await Crossing.findByIdAndUpdate(req.params.id, req.body, {new : true});
        return res.json(crossing);
    },
    async delete(req, res){
        await Crossing.findByIdAndDelete(req.params.id);
        return res.send();
    },
};
