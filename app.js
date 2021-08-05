const fs = require('fs');
const parse = require('csv-parse');
const async = require('async');
const axios = require('axios');


//run this app with node app.js <filename.csv> <s4Tenant:port> <user> <password>
const inputFile = process.argv[2];
const s4URL = process.argv[3]
console.log(s4URL)


//Retrieve XSRF Token (used in POST)
let getToken = function () {
    return new Promise(function (resolve, reject) {  
        console.log("Fetching CSRF token")  
        //return x-csrf-token required to make POST requests
        axios.request({
            url: "/sap/opu/odata/SAP/API_SALES_ORDER_SRV/",
            method: "HEAD",
            baseURL: s4URL,
            headers: {
                "x-csrf-token": "fetch",
                "Authorization": 'Basic '+ process.argv[4]
              },
        }).then((res) => {
            console.log(res.status+" - "+res.statusText)
            if(res.headers['x-csrf-token']){
                console.log("CSRF-Token retrieved")
                resolve(res.headers['x-csrf-token'])
            }else{
                console.error("Couldn't reetrieve CSRF Token")
                reject(err)
            }
        }).catch((err) => {
            console.error(err)
            reject(err)
        });
    })
}

let parser = parse({
    delimiter: ','
}, function (err, data) {
    async.eachSeries(data, function (line, callback) {
        var payload = csvline2SO(line)
        // console.log(payload)
        callback();
    })
});

getToken().then(token => {
    fs.createReadStream(inputFile).pipe(parser);

})


function csvline2SO(line) {
    return {
        "SalesOrderType": "OR",
        "SalesOrganization": "1710",
        "DistributionChannel": "10",
        "OrganizationDivision": "00",
        "SoldToParty": "17100002",
        "SalesOrderDate": line[2] + "T04:00:00",
        "PurchaseOrderByCustomer": "Created via OData - Analytics data load",
        "to_Partner": [{
            "PartnerFunction": "SH",
            "Customer": "17100002"
        }],
        "to_Item": [{
                "Material": line[0],
                "RequestedQuantity": "1"
            },
            {
                "Material": line[1],
                "RequestedQuantity": "1"
            }
        ]
    }
}