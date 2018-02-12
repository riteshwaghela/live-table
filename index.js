/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
   require('./es6/src/challenge')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
// global.DEBUG = false

// const url = "ws://localhost:8011/stomp";
// const client = Stomp.client(url)
// client.debug = function(msg) {
//   if (global.DEBUG) {
//     console.info(msg)
//   }
// }
// var midPriceMap = {};
// function indexOf(name, items) {
//   var i = 0;
//   var len = items.length;
//   for (i = 0; i < len; i++) {
//     if (name === items[i].name) {
//       return i;
//     }
//   }
//   return -1;
// }

// function updateMidPriceMap(data){
//   console.log(data);
//   if(!midPriceMap[data.name]){
//     midPriceMap[data.name] = [(data.bestBid + data.bestAsk) /2];
//   } else if(midPriceMap[data.name].length < 30){
//     midPriceMap[data.name].push(data.bestBid + data.bestAsk /2);
//   } else{
//     midPriceMap[data.name] = [];
//   }
// }



// function connectCallback() {
//   var tableData = [];
//   var midPrice = {};
//   debugger;
//   client.subscribe("/fx/prices", function(message){
//       if(message && message.body) {
//          var currencyData = JSON.parse(message.body);
//          updateMidPriceMap(currencyData);
//          createTable(currencyData);
//       }
//   });
// }


//   function createTable(data) {
//       var columns = Object.keys(data)
//       columns.push('midprice');
      
//       var table = document.getElementById("currency-table");
//       if(document.getElementById('table-columns') === null) {
//           var tr = table.insertRow(-1);     
//           tr.setAttribute('id', 'table-columns');          
//           for (var i = 0; i < columns.length; i++) {
//               var th = document.createElement("th");
//               th.innerHTML = columns[i].toUpperCase();
//               tr.appendChild(th);
//           }    
//        }
      
//       if(document.getElementById(data['name']) === null) {
//           insertRow(table, data, columns);
//       } else {
//           deleteRow((data['name']), table);
//           // the row exist, just replace the row content
//           insertRow(table, data, columns);
//         }
//     }

//     function insertRow(table, data, columns) {
//         var tr = table.insertRow(-1);
//           tr.setAttribute('id', data['name']);
//           for (var j = 0; j < columns.length; j++) {
//               var tabCell = tr.insertCell(-1);
//               tabCell.innerHTML = data[columns[j]];
//               if(j === columns.length - 1) {
//                 tabCell.innerHTML = '';
//                 const sparks = document.createElement('span')
//                 Sparkline.draw(sparks, midPriceMap[data['name']]);
//                 tabCell.appendChild(sparks);
//             }
//           }
//     }

//     function deleteRow(rowid, table)  
//     {   
//       var row = document.getElementById(rowid);
//       table.deleteRow(row.rowIndex);
//     }

// client.connect({}, connectCallback, function(error) {
//   alert(error.headers.message)
// });
