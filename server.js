var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var port = process.env.PORT || 3000;
var nextTodoId = 1;

var todos = [];

app.use(bodyParser.json());

app.all('/test', function (req, res) {
    console.log('Method:' + req.method);
    var body = req.body;
    return res.status(200).send(body);
});

//GET todos
app.get('/todos', function (req, res) {
    var queryParams = req.query;
    var filteredTodos = todos;
    if (queryParams.hasOwnProperty('completed')) {
        if (queryParams.completed === 'false')
            filteredTodos = _.where(filteredTodos, { 'completed': false });
        else if (queryParams.completed === 'true')
            filteredTodos = _.where(filteredTodos, { 'completed': true });
    }

    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {

        filteredTodos = _.filter(filteredTodos, function (todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        });

    }

    res.json(filteredTodos);
});

//GET todos/:id
app.get('/todos/:id', function (req, res) {

    var searchId = parseInt(req.params.id, 10);

    db.todo.findById(searchId).then(function (todo) {
        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e) {
        res.status(500).send();
    });

});


//POST todos
app.post('/todos', function (req, res) {
    var body = req.body;

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    var todo = _.pick(body, 'description', 'completed');
    db.todo.create(todo).then(function (todo) {
        res.json(todo.toJSON())
    }, function (e) {
        res.status(400).json(e);
    });


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


db.sequelize.sync().then(function () {
    app.listen(port, function () {
        console.log('Express server partito alla porta ' + port);
    });
});

