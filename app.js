var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

//run this app with node app.js <filename.csv>
var inputFile= process.argv[2];

var parser = parse({delimiter: ','}, function (err, data) {
  async.eachSeries(data, function (line, callback) {
    console.log(line)
      callback();
  })
});

fs.createReadStream(inputFile).pipe(parser);


