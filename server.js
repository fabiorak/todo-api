var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;
var nextTodoId = 1;

var todos = [];

app.use(bodyParser.json());

//GET todos
app.get('/todos', function (req, res) {
    res.json(todos);
});

//GET todos/:id
app.get('/todos/:id', function (req, res) {

    var searchId = parseInt(req.params.id, 10);

    todos.forEach(function (todo) {
        if (todo.id === searchId) {
            res.json(todo);
        }
    });
    res.status(404).send();
});


//POST todos
app.post('/todos', function (req, res) {
    var body = req.body;
    body.id = nextTodoId++;
    todos.push(body);
    res.send(body);

});




app.get('/about', function (req, res) {
    res.send('About Express');
});
app.use(express.static(__dirname + '/public'));
app.listen(port, function () {
    console.log('Express server partito alla porta ' + port);
});