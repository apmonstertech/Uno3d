const mongoose = require('mongoose');
var db = mongoose.connection;

var CardsSchema = mongoose.Schema({
    value: {
        type: String
    }
})

var Cards = module.exports = mongoose.model('Cards', CardsSchema)

// module.exports.selectAll = function (callback) {
//     Cards.find({}, function (err, docs) {
//         if (!err) {
//             callback(docs)
//         } else { throw err; }
//     })
// }
