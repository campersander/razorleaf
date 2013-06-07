#!/usr/bin/env node

"use strict";

var fs = require("fs");
var path = require("path");
var razorleaf = require("./razorleaf");

for(var i = 2; i < process.argv.length; i++) {
	var file = process.argv[i];

	fs.readFile(file, "utf8", function(error, content) {
		if(error) {
			console.error(error);
			process.exit(1);
		}

		var directory = path.dirname(path.resolve(file));
		var outputFile = path.join(directory, path.basename(file, ".leaf") + ".html");

		var template = razorleaf.compile(content, {
			include: function(name) {
				return fs.readFileSync(path.join(directory, name + ".leaf"), "utf8");
			}
		});

		fs.writeFile(outputFile, template(), {
			encoding: "utf8",
			mode: 0x180
		}, function(error) {
			if(error) {
				console.error(error);
				process.exit(1);
			}

			console.log("Rendered %s as %s", file, outputFile);
		});
	});
}

// vim:ft=javascript
