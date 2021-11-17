var express = require('express');
var app = express();

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path +'query string' +  JSON.stringify(request.query));
    next();
});
app.use(express.urlencoded({ extended: true }));

var products = require('./products.json');
products.forEach( (prod,i) => {prod.total_sold = 0});

app.get("/product_data.js", function (request, response, next) {
   response.type('.js');
   var products_str = `var products = ${JSON.stringify(products)};`;
   response.send(products_str);
});



app.post('/process_form', function (request, response, next) 
{
    let brand = products[0]['brand'];
let brand_price = products[0]['price'];
    var q = request.body['quantity_textbox'];
    if (typeof q != 'undefined') {
        if(isNonNegInt(q)){
            products[0].total_sold += Number(q);
    response.redirect('./order_page.html?quantity='+q);
} else {
    response.redirect('./order_page.html?error=Invalid%20Quantity&quantity_textbox=' + q);
}
    } else{
        response.send(`Hey! you need to pick some stuff!`);
    }
    next();
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback

function isNonNegInt(q, returnErrors = false) {
    errors = [];
    if(q == '') q=0;
    if (Number(q) != q) errors.push('Not a number!');
    else{

  
    if (q < 0) errors.push('Negative value!');
    if (parseInt(q) != q) errors.push('Not an integer!'); 
}
    return returnErrors ? errors : (errors.length == 0) 
}