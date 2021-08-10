const fs = require('fs');
const parse = require('csv-parse');
const async = require('async');
const axios = require('axios');
const transport = axios.create({
})


//run this app with node app.js <filename.csv> <s4Tenant:port> <user> <password>
const inputFile = process.argv[2];
const s4URL = process.argv[3]
console.log(s4URL)
var SO_CREATED=0;

//Retrieve XSRF Token (used in POST)
let getToken = function () {
    return new Promise(function (resolve, reject) {  
        console.log("Fetching CSRF token")  
        //return x-csrf-token required to make POST requests
        transport.request({
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
                var token= {
                    "x-csrf-token": res.headers['x-csrf-token'],
                    "Accept": "application/json",
                    "Content-Type":"application/json",
                    "Cookie": res.headers['set-cookie'],
                  }
                
                resolve(token)
                
            }else{
                console.error("Couldn't reetrieve CSRF Token")
                reject(err)
            }
        }).catch((err) => {
            console.error(err)
            reject(res)
        });
    })
}

let createSO = function (token, data) {
    return new Promise(function (resolve, reject) {  
        console.log("Creating Sales Order")  
        transport.request({
            url: "/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder",
            method: "POST",
            baseURL: s4URL,
            headers: token,
            data: data
        }).then((res) => {
            console.log(res.status+" - "+res.statusText)
            if(res.status == 201){
                console.log("Sales Order Created Successully!")
                resolve()
            }else{
                console.error("Couldn't create sales order")
                reject(res)
            }
        }).catch((err) => {
            console.error(err)
            reject(err)
        });
    })
}

let parser = parse({
    delimiter: ',',
    relax_column_count: true
}, function (err, data) {
    getToken().then(token => {
         async.eachSeries(data, function (line, callback) {
            var data = csvline2SO(line)
            createSO(token,data).then(()=>{
                SO_CREATED++;
                console.log(SO_CREATED+ " SO Created")
            })
            callback();
        })
    })
});


fs.createReadStream(inputFile).pipe(parser);

function csvline2SO(line) {

    let orderDate = line.pop();
    let items = []

    line.forEach(item => {
        items.push({
            "Material": item,
            "RequestedQuantity": "1"
        })
    });


    return {
        "SalesOrderType": "OR",
        "SalesOrganization": "1710",
        "DistributionChannel": "10",
        "OrganizationDivision": "00",
        "SoldToParty": "17100002",
        "SalesOrderDate": orderDate + "T04:00:00",
        "PurchaseOrderByCustomer": "Analytics data load",
        "to_Partner": [{
            "PartnerFunction": "SH",
            "Customer": "17100002"
        }],
        "to_Item": items
    }
}