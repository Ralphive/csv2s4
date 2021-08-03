var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

//run this app with node app.js <filename.csv>
var inputFile = process.argv[2];

var parser = parse({
    delimiter: ','
}, function (err, data) {
    async.eachSeries(data, function (line, callback) {
        var payload = csvline2SO(line)
        console.log(payload)
        callback();
    })
});

fs.createReadStream(inputFile).pipe(parser);

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
