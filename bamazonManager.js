var mysql = require('mysql');
var Table = require('easy-table')
var sleep = require('system-sleep');
var clear = require('clear');
var inquirer = require('inquirer');





////////////////////////////////////////////////////////////////
var printInventory = function(){
    connection.query("SELECT * FROM products", function(err, res){
        
        var t = new Table;
            res.forEach(function(product){
                    t.cell('Product Name', product.product_name)
                    t.cell('Item ID', product.item_id)
                    t.cell('Quantity', product.item_quantity)
                    t.cell('Price', product.price, Table.number(2))
                    t.newRow()
            }); console.log(t.toString());  
        });
        
        startMangerPortal();
}
////////////////////////////////////////////////////////////////////////////
var printLowInv = function(){
             
             connection.query("SELECT * FROM products WHERE item_quantity < 10", function(err, res){
        
            var t = new Table;
            res.forEach(function(product){
                    t.cell('Product Name', product.product_name)
                    t.cell('Item ID', product.item_id)
                    t.cell('Quantity', product.item_quantity)
                    t.cell('Price', product.price, Table.number(2))
                    t.newRow()
            }); console.log(t.toString());  
        });
        startMangerPortal();
}//end printLowInv
//////////////////////////////////////////////////////////////////////////
var addToInv = function(){
                      
                         inquirer.prompt([
                                 {
                                    type: "input",
                                    name: "sku",
                                    message: "Enter the item id.\n"
                                 },
                                 {
                                    type: "input",
                                    name: "qty",
                                    message: "Enter the quantity you wish to add.\n"
                                 }

                        ]).then(function(user) {
                                //validate sku
                                connection.query('SELECT * FROM products WHERE item_id = ' + user.sku, function(err, res){
                               
                                if(!res.length){
                                    console.log('No results found. Please enter a valid ID.');
                                }
                                else{
                                    var qtyInStock = parseInt(res[0].item_quantity); 
                                    //update inventory
                                    connection.query('UPDATE products SET ? WHERE ?' , [{ item_quantity: (parseInt(qtyInStock) + parseInt(user.qty)) }, 
                                                                                        { item_id: user.sku }],                                                                                           

                                    function(err, res){
                                        if (err) {
                                            console.error(result);
                                            return;
                                        }  
                                    });
                                }
                          });
                                
                    });//end of .then 
                    startMangerPortal();
}
//////////////////////////////////////////////////////////////////////////////
var addNewProd = function(){

                             inquirer.prompt([
                                 {
                                    type: "input",
                                    name: "prodName",
                                    message: "Enter the product name.\n"
                                 },
                                 {
                                    type: "input",
                                    name: "deptName",
                                    message: "Enter the department name.\n"
                                 },
                                 {
                                    type: "input",
                                    name: "price",
                                    message: "Enter the price.\n"
                                 },
                                 {
                                    type: "input",
                                    name: "qty",
                                    message: "Enter the quantity.\n"
                                 }


                                 ]).then(function(user) {
                                
                                connection.query("INSERT INTO products SET ?", {

                                    "product_name"      : user.prodName,
                                    "department_name"   : user.deptName,
                                    "price"             : user.price,
                                    "item_quantity"     : user.qty
                                }, function(err) {
                                    if (err) throw err;
                                    console.log(" 1 record inserted successfully");                        
                                });

                        });//end of .then
                       // startMangerPortal();
               
}// end of addNewProd

/////////////////////////////////////////////////////////////////////////////////
var startMangerPortal = function() {

console.log('MANAGER PORTAL BAMAZON');

 inquirer.prompt([
            {
                name: 'confirm',
                type: 'list',
                message: 'Please select your operation.',
                choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit' ],
                default: 'View Products for Sale'
            }

        ]).then(function(user) { 

                if(user.confirm === 'View Products for Sale'){
                    console.log("\n");
                    printInventory();                    
                    //startMangerPortal();
                }

                else if(user.confirm === 'View Low Inventory'){
                       console.log("\n");
                       printLowInv();                       
                }

                else if(user.confirm === 'Add to Inventory'){
                    console.log("\n");
                    addToInv();
                }

                 else if(user.confirm === 'Add New Product'){
                    console.log("\n");
                    addNewProd();
                }

                 else {
                    console.log("\nExiting Manager Portal...");
                    sleep(2000);
                    connection.end();
                    
                }
            });//end of .then
}; 
/////////////////////////////////////////////////////////////////////////////////////////


//main()

 var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : 'zaq1ZAQ!',
  database : 'bamazon_db'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("\nconnected as id " + connection.threadId + "\n");
});


startMangerPortal();