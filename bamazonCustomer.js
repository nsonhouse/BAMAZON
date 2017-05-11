var mysql = require('mysql');
var Table = require('easy-table')
var sleep = require('system-sleep');
var clear = require('clear');
var inquirer = require('inquirer');



////////////////////////////////////////////////////////////
//Welcome Function
var welcome = function(){
connection.query("SELECT * FROM products", function(err, res){
            
            console.log('Welcome to the BAMAZON Store!!' );
            console.log('Please wait, Our inventory will display shortly.\n');
            sleep(2000);
           // printInventory();
            var t = new Table;
            res.forEach(function(product){
                    t.cell('Product Name', product.product_name)
                    t.cell('Item ID', product.item_id)
                    t.cell('Price', product.price, Table.number(2))
                    t.newRow()
            }); console.log(t.toString());  
            askForSale();             
    }); //connection.query
    //return 0;
    
} //end of welcome function
//////////////////////////////////////////////////////////////////////////////////////////////

var printInventory = function(){
    connection.query("SELECT * FROM products", function(err, res){
        
        var t = new Table;
            res.forEach(function(product){
                    t.cell('Product Name', product.product_name)
                    t.cell('Item ID', product.item_id)
                    t.cell('Price', product.price, Table.number(2))
                    t.newRow()
            }); console.log(t.toString());  
        });
        return;
}




//////////////////////////////////////////////////////////////////////////////
function checkInventory( itemid, qty){   
    connection.query('SELECT * FROM products WHERE item_id = ' + itemid, function(err, res){
            //console.log(res);
            if(!res.length){
                console.log('No results found. Please enter a valid ID.');
                askForSale();
            } else {       
                          var price = res[0].price;          
                          var qtyInStock = res[0].item_quantity; 
                          if( qty < 1){
                              console.log('Please enter a value greater than 0.');
                              askForSale();
                          }                           
                         else if(qty <= qtyInStock) {
                              console.log('processing order....\n');
                              sleep(5000);

                              //update inventory
                              connection.query('UPDATE products SET ? WHERE ?' , [{ item_quantity: (qtyInStock - qty) }, 
                                                                                  { item_id: itemid }],
                               function(err, res){
                                   if (err) {
                                       console.error(result);
                                       return;
                                   }  

                                   console.log('Your total is $' + price * qty);                                 
                                   console.log('Thank you for shopping with BAMAZON.');
                                   console.log('We appreciate your business.');
                                   console.log('closing connection....');
                                   sleep(2000);
                                   connection.end();
                               });
                          }
                          else{
                              console.log('We only have ' + qtyInStock + ' items in stock.' );
                              console.log('Please change your order amount.');
                              askForSale();
                          }
                          
                    
                                         }//end of else
            
    });
}


var askForSale = function(){
    inquirer.prompt([
            {
                name: 'confirm',
                type: 'list',
                message: 'Are you ready to make a purchase?.',
                choices: ['yes', 'no'],
                default: 'yes'
            }

        ]).then(function(user) {

            if(user.confirm === 'yes'){
                // ask customer item info
                         inquirer.prompt([
                                 {
                                    type: "input",
                                    name: "sku",
                                    message: "Enter the item id.\n"
                                 },
                                 {
                                    type: "input",
                                    name: "qty",
                                    message: "Enter the quantity you wish to purchase.\n"
                                 }

                        ]).then(function(user) {
                                checkInventory(user.sku, user.qty);
                        });//end of .then
            }
            else{
                console.log('Please feel free to come back soon. GoodBye.');
                sleep(2000);
                connection.end();
                return;
            }

            });//end of .then

};//end of askForSale




var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : 'zaq1ZAQ!',
  database : 'bamazon_db'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});

welcome();






  