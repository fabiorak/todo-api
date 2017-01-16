var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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

    var todo = _.findWhere(todos, { id: searchId });
    if (todo) {
        res.json(todo);
    }
    else {
        res.status(404).send();
    }
});


//POST todos
app.post('/todos', function (req, res) {
    var body = req.body;

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    var todo = _.pick(body, 'description', 'completed');
    todo.id = nextTodoId++;
    todo.description = todo.description.trim();
    todos.push(todo);
    res.send(todo);

});

//PUT todos/:id
app.put('/todos/:id', function (req, res) {

    var body = _.pick(req.body, 'description', 'completed');

    var validAttributes = {};

    var searchId = parseInt(req.params.id, 10);

    var todo = _.findWhere(todos, { id: searchId });

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send('completed deve essere boolean');
    }
    if (body.hasOwnProperty('description') && _.isString(body.description)) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send('description deve essere string');
    }


    _.extend(todo, validAttributes);

    res.send(todo);

});


//DELETE todos/:id
app.delete('/todos/:id', function (req, res) {

    var searchId = parseInt(req.params.id, 10);

    var todo = _.findWhere(todos, { id: searchId });
    if (todo) {
        todos = _.without(todos, todo);
        res.json(todo);
    }
    else {
        res.status(404).send('Nessun todo trovato con id=' + searchId);
    }
});



app.get('/about', function (req, res) {
    res.send('About Express');
});
app.use(express.static(__dirname + '/public'));
app.listen(port, function () {
    console.log('Express server partito alla porta ' + port);
});