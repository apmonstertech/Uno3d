const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0-jrlzy.mongodb.net/FinalProject?retryWrites=true', { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded')
    } else {
        console.log('Error in DB connection : ' + err)
    }
    //mongoimport --host Cluster0-shard-0/cluster0-shard-00-00-qycbe.mongodb.net:27017,cluster0-shard-00-01-qycbe.mongodb.net:27017,cluster0-shard-00-02-qycbe.mongodb.net:27017 --ssl --username Admin --password admin --authenticationDatabase admin --db ProjectGUS --collection quizzes --type csv --out E:\GUSProject\GUS\pytaniaUTF-8Przecinki.csv --fields question,ans1,ans2,ans3,ans4,ansRight
});
