var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var todos = [{
    id: 1,
    description:'Incontrare Mario a pranzo',
    completed: false
},{
    id: 2,
    description:'Andare al mercato',
    completed: false
},{
    id: 3,
    description:'Mangiare il gatto',
    completed: true
}];

//GET todos
app.get('/todos', function (req, res) {
    res.json(todos);
});

//GET todos/:id
app.get('/todos/:id', function (req, res) {
    
    var searchId= parseInt(req.params.id,10);
    
    todos.forEach(function(todo) {
        if(todo.id===searchId)
        {
            res.json(todo);   
        }
    });
        res.status(404).send();
});


app.get('/about', function (req, res) {
    res.send('About Express');
});
app.use(express.static(__dirname + '/public'));
app.listen(port, function () {
    console.log('Express server partito alla porta ' + port);
});