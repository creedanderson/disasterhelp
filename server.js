// server.js
// where your node app starts
// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var cookieParser = require('cookie-parser');
app.use(cookieParser());
//app.use(express.cookieParser());

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE users (username TEXT, password TEXT, address TEXT, need_help TEXT)');
    console.log('New table users created!');
    db.run('CREATE TABLE items (item_id INTEGER PRIMARY KEY, item_name TEXT, url TEXT, quantity NUMBER, date_bought NUMBER, username TEXT)');
    console.log('New table items created!');
    
    // insert default users
    db.serialize(function() {
      //insert into table_name (list, of,column,names, separated,by,commas) values ('here', 'are', 'thte', 'values');
      db.run('INSERT INTO users (username, pasword, address, need_help)VALUES("creed", "hello", "6590 arequa ridge lane", "no")');
      db.run('INSERT INTO users (username, pasword, address, need_help)VALUES("laney", "poop", "6590 arequa ridge lane", "yes")');
    });
  }
  else {
    console.log('Database ready to go!');
    //db.run('drop table items');
       // db.run('CREATE TABLE items (item_id INTEGER PRIMARY KEY, item_name TEXT, url TEXT, quantity NUMBER, date_bought NUMBER, username TEXT)');
    //db.run('INSERT INTO items(item_name, url, quantity, bought, date_bought)VALUES("hat","hat.com", 1, "no","not bought yet")');
    db.each('SELECT username from users', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.get('/sign_up.html', function(request, response) {
  response.sendFile(__dirname + '/views/sign_up.html');
});
app.get('/login.html', function(request, response) {
  response.sendFile(__dirname + '/views/login.html');
});
app.get('/items-to.html', function(request, response) {
  response.sendFile(__dirname + '/views/items-to.html');
});


// endpoint to get all the dreams in the database
// currently this is the only endpoint, ie. adding dreams won't update the database
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get('/getDreams', function(request, response) {
  db.all('SELECT * from Dreams', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});

app.get('/getitems', function(request, response) {
  db.all('SELECT * from items', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});

/*app.get('/getUsers', function(request, response) {
  db.all('SELECT * from users', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});
*/
app.post('/signIn', function(request, response) {
  console.log('at signIn route. username ' + request.body.username + ' password ' + request.body.password);
 
  db.get ('select count (*) user_count from users where username=? and password=?',[request.body.username, request.body.password],(err, row) =>{

    if (err) {
      response.sendFile(__dirname + '/views/login_invalid.html',{isValid:'no'});
    }
    if (row.user_count>0) {
      response.sendFile(__dirname + '/views/items-to.html',{isValid:'yes'});
    } else {
      response.sendFile(__dirname + '/views/login_invalid.html',{isValid:'no'});
    }
  });
});

app.post('/itemsform', function(request, response) {
  
  var itemName=request.body.itemName;
  var itemUrl=request.body.itemUrl;
  var itemNumber=request.body.itemNumber;
  var user = request.cookies['user'];
  var stmt = db.prepare('insert into items(item_name, url, quantity, username) VALUES (?,?,?,?)');
  stmt.run(itemName, itemUrl, itemNumber, user);
  stmt.finalize();
  //db.run ('insert into items(item_name, url, quantity, bought, date_bought) VALUES (itemName,"ah ah",45,"y","")');
  //response.render('/items-to.html');
  console.log('Cookies: ', request.cookies);
  response.sendFile(__dirname + '/views/items-to.html');
   //this is the cookies are 
});


app.post('/bought', function(request, response){
  var date= new Date();
  var sqlite_date = date.toISOString();
  var itemId = request.body.itemId;
  console.log('item id is ' + itemId);
  var update_stmt = db.prepare('update items set date_bought = ? where item_id = ?');
  
  update_stmt.run( sqlite_date, itemId)  
  update_stmt.finalize();
  response.sendFile(__dirname + '/views/items-to.html');
});

app.post('/loginform', function(request, response){
  var userName = request.body.username;
  response.cookie('user', userName);
  response.sendFile(__dirname + '/views/items-to.html');
  
});
//put cookie here____from ^up__________________________________________________________________________________________________________
//----------------------

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});


app.post('/usersform', function(request, response) {
  
  var username = request.body.username
  var password = request.body.password
  var address = request.body.address
  
  var need_help = request.body.need_help
  var users_stmt = db.prepare('insert into users(username, password, address, need_help) VALUES (?,?,?,?)');
  users_stmt.run(username, password, address, need_help);
  users_stmt.finalize();
  
  response.sendFile(__dirname + '/views/items-to.html');
})

