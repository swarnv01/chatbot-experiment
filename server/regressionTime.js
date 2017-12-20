const LinearRegression = require('shaman').LinearRegression,
      fs = require('fs'),
      csvParse = require('csv-parse')

function trainBot(filepath, callback) {
  fs.readFile(filepath, 'utf8', function(err, dataStr) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    csvParse(dataStr, function(err, data) {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      var X = data.map(function(r) { return [Number(r[1]), Number(r[2])]; });
      var y = data.map(function(r) { return Number(r[4]); });

      // Initialize and train the linear regression
      var lr = new LinearRegression(X, y, {algorithm: 'NormalEquation'});
      lr.train(function(err) {
        if (err) {
          console.log('error', err);
          process.exit(2);
        }
      })
      callback(lr)
    })
  })
}

// function predict(arr, lr) {
//   return lr.predict(arr)
// }

module.exports = {
    trainBot: trainBot
    // predict: predict
}


// fs.readFile('./data.csv', 'utf8', function(err, dataStr) {
//   if (err) {
//     console.log(err);
//     process.exit(1);
//   }
//   csvParse(dataStr, function(err, data) {
//     if (err) {
//       console.log(err);
//       process.exit(1);
//     }
//     var X = data.map(function(r) { return [Number(r[1]), Number(r[2])]; });
//     var y = data.map(function(r) { return Number(r[4]); });
//
//     console.log(y)
//
//     // Initialize and train the linear regression
//     var lr = new LinearRegression(X, y, {algorithm: 'NormalEquation'});
//     lr.train(function(err) {
//       if (err) {
//         console.log('error', err);
//         process.exit(2);
//       }
//
//       // Use the linear regression function to get a set of data to graph the linear regression line
//       var y2 = [];
//       X.forEach(function(xi) {
//         y2.push(lr.predict(xi));
//       });
//       console.log(y2)
//     });
//   });
// });
