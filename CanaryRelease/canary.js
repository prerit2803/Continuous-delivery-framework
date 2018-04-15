var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var httpProxy = require('http-proxy');
var request = require("request");
var app = express()
var ipDataStable ;
var ipDataNew ;
var temp ;
var count

var options = {};
var proxy   = httpProxy.createProxyServer(options);

var alert = false;
var server;
var count = 1;
///////////// WEB ROUTES
app.use(function(req, res, next)
{
  console.log(req.method, req.url);
  var port = 80
  

console.log("Something went wrong:", alert);
  if(count % 4 != 0 || alert === true)
  {
    // count = ipDataStable.length;
    // var ran = Math.floor(Math.random() * (count))
    
    server = ipDataStable;
    temp = ipDataStable;  
    count++; 
    console.log("Stable Server called :"+ipDataStable);
}
  else
  {
    // count = ipDataNew.length;
    // var ran = Math.floor(Math.random() * (count))
    server = ipDataNew;
    temp = ipDataNew;   
          console.log("CanaryServer called: ", ipDataNew);
    count++; 
          
        
}
  //console.log("Traffic is redirecting to new instance : http://"+temp+":"+port);
  proxy.web( req, res, {target: 'http://'+temp+":"+port } );


});

var refreshId = setInterval(function()
        {
        
          try
          {
            console.log("App is running at", 'http://'+temp+":80");
            request('http://'+temp+":80/api/study/listing",{timeout: 1500}, function (error, res, body) {

              
                
                if( res == undefined || res.statusCode != 200)
                {
                  alert = true;
                  console.log("Error! An alert is issued! ");
                  clearInterval(refreshId);
              }
            })
          }
          catch(e)
          {
            console.log("Alert: Given service has some issues ");
            alert = true;
          }

      }, 2500);
 var server = app.listen(3000, function () {

 var host = server.address().address
   var port = server.address().port
   ipDataStable = fs.readFileSync('/home/vagrant/data/stableInstance').toString().split("\n");
  
   // for(i=0;i<array.length;i++){
   //  if(array[i] !=""){
   //   ipDataStable.push(array[i])
   //      }
   // }

   temp = ipDataStable;
 ipDataNew = fs.readFileSync('/home/vagrant/data/canaryInstance').toString().split("\n");
 
   // for(i=0;i<array.length;i++){
   //  if(array[i] !=""){
   //   ipDataNew.push(array[i])
   //      }
   // }
 })