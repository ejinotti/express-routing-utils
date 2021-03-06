'use strict';

var fs = require('fs');
var path = require('path');

function getSubFolders(dir) {
  return fs.readdirSync(dir).reduce(function (folders, file) {
    var fullPath = path.join(dir, file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      folders.push(file);
    }

    return folders;
  }, []);
}

function mountSubRoutes(prefix, router, currentDir) {
  getSubFolders(currentDir).forEach(function (folder) {
    require(path.join(currentDir, folder))(prefix + '/' + folder, router);
  });
}

function getMounter(currentDir) {
  return function (mountingCb) {
    return function (prefix, router) {
      mountSubRoutes(prefix, router, currentDir);
      mountingCb(prefix, router);
    };
  };
}
exports.getMounter = getMounter;

function collectRoutes(stack, routes) {
  stack.forEach(function (mw) {
    if (mw.route && mw.route.path) {
      routes.push({
        path: mw.route.path,
        methods: Object.keys(mw.route.methods).filter(function (meth) {
          return mw.route.methods[meth];
        }),
      });
    } else if (mw.name === 'router') {
      collectRoutes(mw.handle.stack, routes);
    }
  });
  return routes;
}

function getRoutes(appOrRouter) {
  if (appOrRouter.stack) {
    return collectRoutes(appOrRouter.stack, []);
  } else if (appOrRouter._router && appOrRouter._router.stack) {
    return collectRoutes(appOrRouter._router.stack);
  } else {
    return ['Cannot collect routes.'];
  }
}
exports.getRoutes = getRoutes;
