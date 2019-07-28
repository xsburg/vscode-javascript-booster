'use strict';

const path = require('path');

const repoDir = path.resolve(__dirname, '../');

const resolve = function(baseDir, nextDir, args) {
    let pathArray = [baseDir];
    if (nextDir) {
        pathArray.push(nextDir);
    }
    return path.resolve.apply(path.resolve, pathArray.concat(Array.from(args)));
};

module.exports = {
    createResolver: function(baseDir) {
        return function() {
            return resolve(baseDir, null, arguments);
        };
    },

    repo: function() {
        return resolve(repoDir, null, arguments);
    },
    client: function() {
        return resolve(repoDir, 'client', arguments);
    },
    server: function() {
        return resolve(repoDir, 'server', arguments);
    }
};
