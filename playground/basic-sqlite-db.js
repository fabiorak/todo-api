var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-db.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validatio: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})
sequelize.sync({
    force: true
}).then(function () {
    console.log('Tutto sincronizzato');
    Todo.create({
        description: 'Mangiare Gatto',
        completed: false
    }).then(function (todo) {
        Todo.create({
            description: 'Mangiare Cane',
            completed: false
        });
    }).then(function () {
        return Todo.findAll({
            where: {
                description: { $like: '%gatt%' },
                completed: false
            }
        });
    }).then(function (todos) {
        todos.forEach(function (todo) {
            console.log('todo:  ');
            console.log(todo.toJSON());
        }, this);
        console.log('Finito');

    }).catch(function (e) {
        console.log(e);
    });
});