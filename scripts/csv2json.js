/*jshint node:true*/

'use strict';

var fs = require('fs');
var csv = require('dsv').csv;

console.log(JSON.stringify(require('dsv').csv.parse(require('fs').readFileSync(process.argv[2], {
	encoding: 'utf8'
})).reduce(function(subdivisions, row) {
	var code;

	code = row['Cantón'];
	delete row['Cantón'];

	subdivisions[code] = row;

	return subdivisions;
}, {}), null, '\t'));
