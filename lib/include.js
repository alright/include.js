/*jshint node: true */
'use strict';

var path = require('path'),
	fQuery = require('fquery'),

	getHeaderComment = function (content) {
		return content.match(/^\s*\/\*/) ? content.substr(0, content.indexOf('*/') + 2).trim() + '\n' : '';
	},

	processFile = function (options, inFile, outFile) {
		if ( ! inFile || ! outFile) {
			fQuery.error({ method: 'processFile', message: 'input and output file must be specified' });
		}

		var ext = path.extname(inFile),
			f = fQuery(inFile),
			header = getHeaderComment(f.content()),
			message = inFile + ' -> ' + outFile;

		if (ext === '.js') {
			fQuery.info({ method: 'js', message: message });
			f.includify();
		} else {
			fQuery.error({ method: 'processFile', message: 'unsupported extension: ' + ext });
		}

		if (options.overwrite) {
			f.write(fQuery.OVERWRITE, outFile);
		} else {
			f.write(outFile);
		}
	},

	processDir = function (options, inDir, outDir) {
		fQuery.info({ method: 'processDir', message: inDir + ' -> ' + outDir });

		if ( ! inDir || ! outDir) {
			fQuery.error({ method: 'processFile', message: 'input and output file must be specified' });
		}

		fQuery(inDir + ': **/*.js').each(function (blob) {
			var inFile = blob.source,
				outFile = inFile.replace(inDir, outDir);

			processFile(options, inFile, outFile);
		});
	};

module.exports = {
	processFile: processFile,
	processDir: processDir
};
