/*jshint node:true*/

'use strict';

var fs = require('fs');
var assert = require('assert');
var csv = require('dsv').csv;
var jsdom = require('jsdom');
var async = require('async');
var cantons = require('../../divisiones-territoriales-data/data/json/adm2-cantones.json');

function name2code(name) {
	var code, canton;

	switch (name) {
	case 'León Cortes':
		name = 'León Cortés Castro';
		break;
	case 'Coronado':
		name = 'Vázquez de Coronado';
		break;
	}

	for (code in cantons) {
		canton = cantons[code];
		if (name === canton.Nombre) {
			return code;
		}
	}

	throw new Error('Code for "' + name + '" not found.');
}

async.waterfall(process.argv.slice(2).map(function(html) {
	return function(rows, cb) {
		if (arguments.length < 2) {
			cb = rows;
			rows = [];
		}

		jsdom.env(fs.readFileSync(html, {encoding: 'utf8'}), function(errs, window) {
			var index, trs, text, document = window.document;

			if (errs) {
				return cb(errs);
			}

			text = function(node) {
				return node.textContent.trim();
			};

			index = text(document.querySelector('#informacion-mapa > h3'));
			assert(index);

			trs = document.querySelectorAll('#informacion-mapa table.tabla tr');
			assert(trs.length);

			Array.prototype.forEach.call(trs, function(tr) {

				// Skip header row (table has no thead/tbody).
				if ('th' === tr.children[0].tagName.toLowerCase()) {
					return;
				}

				rows.push({
					'Índice': index,
					'Año': 2011,
					'Cantón': name2code(text(tr.children[1])),
					'Posición': text(tr.children[0]),
					'Valor': parseFloat(text(tr.children[2]).replace(',', '.'), 10)
				});
			});

			window.close();

			cb(null, rows);
		});
	};
}), function(err, rows) {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	console.log(csv.format(rows));
});
