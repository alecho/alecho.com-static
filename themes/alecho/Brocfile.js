/* Brocfile.js */

// Import some Broccoli plugins
var compileSass = require('broccoli-sass');
var mergeTrees = require('broccoli-merge-trees');

// Specify the Sass directory
var sassDir = 'assets/scss';

// Tell Broccoli how we want the assets to be compiled
var styles = compileSass([sassDir], 'style.scss', 'css/style.css', {outputStyle: 'compressed'});

// Merge the compiled styles and scripts into one output directory.
module.exports = mergeTrees([styles]);
