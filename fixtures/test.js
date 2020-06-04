const fs = require('fs');
const { resolve } = require('path');
const babel = require('@babel/core');
const plugin = require('../lib/babel-plugin-transform-ember-concurrency-async-tasks');

for (let entry of fs.readdirSync(__dirname, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    test(entry.name, async () => {
      let inputPath = resolve(__dirname, entry.name, 'input.js');
      let outputPath = resolve(__dirname, entry.name, 'output.js');

      let input = await fs.promises.readFile(inputPath, { encoding: 'utf8' });
      let output = await fs.promises.readFile(outputPath, { encoding: 'utf8' });

      let { code } = await babel.transformAsync(input, {
        filename: inputPath,
        plugins: [
          [plugin],
          ['@babel/plugin-syntax-decorators', { legacy: true }],
          ['@babel/plugin-syntax-class-properties'],
          ['babel-plugin-recast']
        ],
      });

      expect(code).toBe(output);
    });
  }
}
