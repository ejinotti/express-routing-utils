Some util functions for Express route organization.

#### Usage

Structure project like:

```
/routes
  /stuff
    /substuff
      index.js
    index.js
  index.js
app.js
```

In main app file:

```Javascript
// app.js
app.use('/', require('./routes');
```

In `routes/index.js`:

```Javascript
// routes/index.js
var appRouter = require('express').Router();
var mount = require('express-routing-utils').getMounter(__dirname);

mount(function (prefix, router) {
  router.get('/', function (req, res) {
    res.send('This is the root route');
  });
})('', appRouter);

module.exports = appRouter;
```

Then in all sub-`index.js`'s you can just do:

```Javascript
// routes/stuff/index.js
var mount = require('express-routing-utils').getMounter(__dirname);

module.exports = mount(function (prefix, router) {
  router.get(prefix, function (req, res) {
    res.send('This is mounted as /stuff');
  });
  router.get(prefix + '/:id', function (req, res) {
    res.send('This is mounted as /stuff/:id');
  });
});

// routes/stuff/substuff/index.js
var mount = require('express-routing-utils').getMounter(__dirname);

module.exports = mount(function (prefix, router) {
  router.get(prefix, function (req, res) {
    res.send('This is mounted as /stuff/substuff');
  });
  router.get(prefix + '/:id', function (req, res) {
    res.send('This is mounted as /stuff/substuff/:id');
  });
});
```

There is also a `getRoutes` function which takes either an `app` or `router` and will return an array of all mounted routes:

```Javascript
// example use in app.js
var getRoutes = require('express-routing-utils').getRoutes;

app.get('/routes', function (req, res) {
  res.send(getRoutes(app));
});
```
