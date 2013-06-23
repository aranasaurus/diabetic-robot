var express = require('express');
var app = express();

app.configure(function() {
  app.use(express.bodyParser());
});

var jf = require('jsonfile');
jf.spaces = 2;

var getData = function(model) {
  try {
    var dataPath = './data/' + model + '.json';
    data = jf.readFileSync(dataPath);
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

app.get('/api/:model.:format?', function(req, res) {
  var data = getData(req.params.model);
  if (data) {
    return res.send(data);
  } else {
    return res.send(404, "No data found for '" + req.params.model + "'.");
  }
});

app.all('/api/clear/:model', function(req, res) {
  jf.readFile('./data/' + req.params.model + '.json', function(err, data) {
    if (err) {
      return res.send(404, "No data found for '" + req.params.model + "'.");
    } else {
      jf.writeFileSync('./data/' + req.params.model + '.json', [])
      return res.redirect('./api/' + req.params.model);
    }
  });
});


app.put('/api/:model/:id', function(req, res) {
  var data = getData(req.params.model) || [];
  for (var i=0; i<data.length; i++) {
    var d = data[i];
    if (d.timestamp === req.params.id) {
      d = req.body;
      data[i] = d;
      jf.writeFileSync('./data/' + req.params.model + '.json', data);
      return res.send(d);
    }
  }
  return res.send(404, "No data found for " + req.params.id + ". Did you mean to POST instead?");
});

// TODO: input verification!
app.post('/api/:model', function(req, res) {
  var data = getData(req.params.model) || [];
  if (req.body) {
    data.push(req.body);
    jf.writeFileSync('./data/' + req.params.model + '.json', data);
  }
  return res.send(data[data.length-1]);
});

app.get('/', function(req, res) {
  res.send('<html><body>Try <a href="/api/tests">/api/tests</a>!</body></html>');
});


app.listen(3000);
