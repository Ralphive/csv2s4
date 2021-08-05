# csv2s4
Read a CSV file and create Sales Orders in S/4 Hana Cloud

## Pre reqs:
* [NodeJS](https://nodejs.org/en/)

* CSV file in the format:
`item1,item2,yyyy-mm-dd`

* Sales order API running. [Check the official docs](https://help.sap.com/viewer/19d48293097f4a2589433856b034dfa5/1909.002/en-US/28d644581efca007e10000000a441470.html)
`/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder`

## To run this app

* Clone/Download it
* Install the dependencies
`npm install`
* run it with this format
`node app.js <csv file path> <s4 tenant URL> <base64 user:password>`

Example
`node app.js myfile.csv https://my666666.s4hana.ondemand.com SWFtS2luZE9mOkFIYWNrZXJNeXNlbGZUb28=`

use [base64 encode](https://www.base64encode.org/) to get the value