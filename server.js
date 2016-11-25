var express = require('express');
var app = express();
var port = process.env.PORT || 3000;


app.get('/about', function (req, res) {
    res.send('About Express');
});
app.use(express.static(__dirname + '/public'));
app.listen(port, function () {
    console.log('Express server partito alla porta ' + port);
});