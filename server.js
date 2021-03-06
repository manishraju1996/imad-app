var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user: 'manishraju1996',
    database: 'manishraju1996',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));

function createTemplate(data) {
var title = data.title;
var heading = data.heading;
var content = data.content;
var htmlTemplate= `
<html>
    <head>
        <title>${title}</title>
         <link rel="shortcut icon" href="http://filecatalyst.com/wp-content/uploads/2014/10/direct_160.png" data-reactid=".35kd9lse80.0.0">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
        <div class="center">
            <hr/>
        <h3>${heading}</h3>
        <div>
            ${content}
        </div>
        </div>
        <p/>
         <div class="center">
               <a class="btn" href="http://manishraju1996.imad.hasura-app.io">HOME</a>
        </div>
    </body>
    
</html>
`;
return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/test-db', function (req,res){
    pool.query('SELECT * FROM test', function(err, result) {
        if(err){
            res.status(500).send(err.toString());
        } else {
            res.send(JSON.stringify(result.rows));
        }
    });
});
app.get('/articles/:articleName',function(req,res){
 // var articleName = req.params.articleName;
 pool.query("SELECT * FROM article WHERE title = $1",[req.params.articleName], function(err,result){
    if(err){
        res.status(500).send(err.toString());
    } else{
        if(result.rows.length === 0) {
            res.status(404).send('Article Not Found');
    } else{
        var articleData = result.rows[0];
        res.send(createTemplate(articleData));
    }
    }
 });
    });
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
