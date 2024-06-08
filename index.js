const express = require('express');
const app = express();
const con = require('./sql');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const path = require('path');
const axios = require('axios');

app.use(express.static(path.join(__dirname, "assets")))

app.set('view engine', 'ejs');

async function passdata(qs) {
    return new Promise((resolve, reject) => {
        con.query(qs, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    });
}

app.get('/', async(req, res) => {
    res.render('index');
});
app.get('/users', async(req, res) => {

    var query = `SELECT users.*,states.state,cities.city FROM users left join states on states.id_state = users.state left join cities on cities.id_city = users.city`;
    var users_data = await passdata(query);
    res.render('users', { users: users_data });
});

app.get('/add_user', async(req, res) => {
    var query = "SELECT * FROM states where country_id = 101";
    var states_data = await passdata(query);
    res.render('add', { states: states_data });
});

app.post('/store_user', urlencodedParser, async(req, res) => {
    var query = `insert into users (name,email,password,address,state,city,zip) values ("${req.body.name}","${req.body.email}","${req.body.password}","${sssreq.body.address}",${req.body.state},${req.body.city},${req.body.zip})`;
    await passdata(query);
    res.redirect('/users');
});

app.get('/users_edit/:id', async(req, res) => {
    var query = `SELECT * FROM users where id = ${req.params.id}`;
    var users_data = await passdata(query);
    var query = "SELECT * FROM states where country_id = 101";
    var states_data = await passdata(query);
    res.render('edit', { users: users_data, states: states_data });
});

app.post('/update_user/:id', urlencodedParser, async(req, res) => {
    var query = `UPDATE users SET name='${req.body.name}',email='${req.body.email}',password=${req.body.password}, address='${req.body.address}',state='${req.body.state}',city='${req.body.city}',zip='${req.body.zip}' where id=${req.params.id}`;
    await passdata(query);
    res.redirect('/users');
});


app.get('/city_according_to_state/:state_id', async(req, res) => {
    var query = `SELECT * FROM cities where state_id = ${req.params.state_id}`;
    var cities_data = await passdata(query);
    res.json(cities_data);
});

app.listen(6969);