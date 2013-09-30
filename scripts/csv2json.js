/*jshint node:true*/

'use strict';

var fs = require('fs');
var csv = require('dsv').csv;

console.log(JSON.stringify(require('dsv').csv.parse(require('fs').readFileSync(process.argv[2], {
	encoding: 'utf8'
})).reduce(function(subdivisions, row) {
	var code, index, year;

	code = row['Cantón'];
	delete row['Cantón'];

	if (!subdivisions[code]) {
		subdivisions[code] = {};
	}

	index = row['Índice'].match(/\(([A-Za-z]+)\)/)[1];
	delete row['Índice'];

	year = row['Año'];
	delete row['Año'];

	if (!subdivisions[code][index]) {
		subdivisions[code][index] = {};
	}

	subdivisions[code][index][year] = row;

	return subdivisions;
}, {}), null, '\t'));
