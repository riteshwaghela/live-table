(function() {
    let midPriceMap = {}; // A map to store calculated mid price and timestamps
    let columns; // It will store the table columns

    const CONSTANTS = {
        SERVER_URL: "ws://localhost:8011/stomp",
        MID_PRICE_UPDATE_INTERVAL: 30000,
        FX_ENDPOINT:"/fx/prices"
    }; // Simulating a config

    // Singleton StomplClient class to get the stomp client instance
    const StompClient = (function (url) {
        var instance;
        function createInstance() {
            const client = Stomp.client(url);
            return client;
        }
    
        return {
            getInstance: function () {
                if (!instance) {
                    instance = createInstance();
                }
                return instance;
            }
        };
    })(CONSTANTS.SERVER_URL);

    /**
     * Entry point of this program. It estabilishes a connection with stomp server
     * and when the connection is successful, the onConnectionSuccessful is executed
     */
    function main() {
        const stompClient = StompClient.getInstance();
        stompClient.connect({}, onConnectionSuccessful, (error) => {
            console.error("Could not connect to server  ", error);
        });
    }

    /**
     * This fn is excuted when the connection with stomp server is successful.
     */
    function onConnectionSuccessful() {
        // Subscribe to the endpoint to get the updated currency pair data
        StompClient.getInstance().subscribe(CONSTANTS.FX_ENDPOINT, (message) => {
            if(message && message.body) {
                let currencyData; 
                try{
                    currencyData = JSON.parse(message.body);
                } catch(e){
                    console.log("Exception occured while processing response ", e);
                }
               
                updateMidPriceMap(currencyData);
                if(!columns) {
                    // Columns are going to be same, so store it once, to be used later
                    columns = Object.keys(currencyData);
                    columns.push('midprice')
                }
                createTable(currencyData, columns);
            }
        });
    }

    /**
     * This function maintains a map that has timestamp and midPrice data.
     * It stores the midPrice data of last 30 seconds of a currency  pair
     * @param {*} data data received from stomp server
     */
    function updateMidPriceMap(data) {
        if(data){
            if(!midPriceMap[data.name]) {
                // if the data doesn't exist for this currency pair, update it with data
                midPriceMap[data.name+'ts'] = new Date().getTime();
                midPriceMap[data.name] = [(data.bestBid + data.bestAsk) /2];
            } else if(new Date().getTime() - midPriceMap[data.name+'ts']  >= CONSTANTS.MID_PRICE_UPDATE_INTERVAL){
                // Reset the timestamp for this currency pair with the latest timestamp as it is older than 30 seconds
                midPriceMap[data.name+'ts'] = new Date().getTime();
                // Reset the mid price data for this curreny
                midPriceMap[data.name] = [];
            }else {
                midPriceMap[data.name].push(data.bestBid + data.bestAsk /2);
            }
        }
        
    }

    /**
     * Creates a table dynamically
     * @param {} data data to be rendered
     */
    function createTable(data, columns) {
        if(!data){
            return;
        }
        const table = document.getElementById("currency-table");

        // We want to create column only once
        if(document.getElementById('table-columns') === null) {
            // create the row for columns in dom with a unique id
            createTableHeadings(table, 'table-columns', columns);  
        }
        // Create row in table only if a row with that id doesn't exist
        if(table.querySelector('#'+data['name']) === null) {
            createRow(table, data, columns);
        } else {
            // If the row exist, delete and re-create the row with the new data
            deleteRow((data['name']), table);
            createRow(table, data, columns);
        }

        sortTable(table, columns.indexOf('lastChangeBid'));
    }

    /**
     * Creates table heading for the given table
     * @param {*} table 
     * @param {*} id 
     * @param {*} columns 
     */
    function createTableHeadings(table, id, columns){
         const tr = table.insertRow(-1);     
         tr.setAttribute('id', id);          
         for (let i = 0; i < columns.length; i++) {
            const th = document.createElement("th");
            th.setAttribute('id', columns[i]);
            const header = document.createTextNode(columns[i].toUpperCase());
            th.appendChild(header);
            tr.appendChild(th);
        }  
    }

    /**
     * Creates row for the given table
     * @param {*} table 
     * @param {*} data 
     * @param {*} columns 
     */
    function createRow(table, data, columns) {
        const tr = table.insertRow(-1);
        tr.setAttribute('id', data['name']);
        for (let j = 0; j < columns.length; j++) {
            const tabCell = tr.insertCell(-1);
            const cellContent = document.createTextNode(data[columns[j]]);
            tabCell.appendChild(cellContent);
            if(columns[j] == 'lastChangeBid' && data[columns[j]] < 0) {
                tabCell.style.backgroundColor = 'red';
            }
            // Override the last column with sparkline
            if(j === columns.length - 1) {
                tabCell.innerHTML = '';
                const sparks = document.createElement('span')
                if(midPriceMap[data['name']].length) {
                    Sparkline.draw(sparks, midPriceMap[data['name']],  {
                    lineColor: "#666",
                    endColor: "blue",
                    maxColor: "green",
                    minColor: "red",
                    dotRadius: 3,
                    width: 120,
                    tooltip: function(value, index, collection){
                        return value;
                    }
                });
                tabCell.appendChild(sparks);
                }
            }
        }
    }

    /**
     * sorts the table in descending order
     * @param {*} table 
     * @param {*} col 
     */
    function sortTable(table, col) {
        var tb = table.tBodies[0],
            tr = Array.prototype.slice.call(tb.rows, 0),
            i;
        tr = tr.sort(function (a, b) { 
            return -1 * (a.cells[col].textContent.trim()
                    .localeCompare(b.cells[col].textContent.trim(),  undefined, {numeric: true})
                );
        });
        for(i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); 
    }

    /**
     * Delets the given row from the provided table
     * @param {*} rowid row to be deleted
     * @param {*} table table ref
     */
    function deleteRow(rowid, table) {   
      const row = document.getElementById(rowid);
      table.deleteRow(row.rowIndex);
    }

    main();
})();
