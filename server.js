var serveStatic = require('serve-static');
const app = require('./controller/app.js');

var port = 3000;
var hostname = "localhost";

app.use(serveStatic(__dirname + '/public'));

const server = app.listen(port, hostname, function () {

    console.log(`Web App Hosted at http://${hostname}:${port}/`);

});
