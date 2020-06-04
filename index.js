'use strict';

const { addPlugin } = require('ember-cli-babel-plugin-helpers');

module.exports = {
  name: require('./package').name,

  included(parent) {
    this._super.included.apply(this, arguments);

    addPlugin(parent, require.resolve('./lib/babel-plugin-transform-ember-concurrency-async-tasks'), {
      after: ['@babel/plugin-transform-typescript'],
      before: ['@babel/plugin-proposal-decorators']
    });
  }
};
