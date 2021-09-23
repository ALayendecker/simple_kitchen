const express = require('express');
const mongojs = require('mongojs');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

const databaseUrl = 'kitchen_db';
const collections = ['items'];

const db = mongojs(databaseUrl, collections);

db.on('error', (error) => {
  console.log('Database Error:', error);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + './public/index.html'));
});

app.post('/submit', (req, res) => {
  console.log(req.body);

  db.items.insert(req.body, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

app.get('/all', (req, res) => {
  db.items.find({}, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
  });
});

app.get('/find/:id', (req, res) => {
  db.items.findOne(
    {
      _id: mongojs.ObjectId(req.params.id),
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

app.post('/update/:id', (req, res) => {
  db.items.update(
    {
      _id: mongojs.ObjectId(req.params.id),
    },
    {
      $set: {
        title: req.body.title,
        item: req.body.item,
        modified: Date.now(),
      },
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

app.delete('/delete/:id', (req, res) => {
  db.items.remove(
    {
      _id: mongojs.ObjectID(req.params.id),
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

app.delete('/clearall', (req, res) => {
  db.items.remove({}, (error, response) => {
    if (error) {
      res.send(error);
    } else {
      res.send(response);
    }
  });
});

app.listen(3000, () => {
  console.log('App running on port 3000!');
});
