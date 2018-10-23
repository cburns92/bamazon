var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon"
});

var viewProduct = function() {
    var query = connection.query("SELECT * FROM products", function(err,response){
        if(err) throw err;
        console.log("")
        for(var i = 0; i < response.length; i++){
            console.log("---------------------------------------------------------------------------------------------------")
            console.log("ID: " + response[i].id + " || Product: " + response[i].product + " || Department: " + response[i].department + " || Price: " + response[i].price + " || In Stock: " + response[i].stock)
        }
        connection.end();
    })
}

var viewLowCall = function(){
    var query = connection.query("SELECT * FROM products WHERE stock < 5", function(err,response){
        if(err) throw err;
        console.log("")
        for(var i = 0; i < response.length; i++){
            console.log("---------------------------------------------------------------------------------------------------")
            console.log("ID: " + response[i].id + " || Product: " + response[i].product + " || Department: " + response[i].department + " || Price: " + response[i].price + " || In Stock: " + response[i].stock)
        }
        connection.end();
    })
}

var addInventory = function(){
    
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "What is the ID of the product that you would like to resupply?",
        validate: function(value) {
            if (isNaN(value) ===  false && parseInt(value) > 0){
                return true;
            }
        },
        filter: Number
    },{
        name: "quantity",
        type: "input",
        message: "How many would you like to add?",
        validate: function(value) {
            if (isNaN(value) ===  false && parseInt(value) > 0){
                return true;
            }
            else{
                console.log("Invalid Quantity (Must be at least 1).")
            }
        },
        filter: Number

    }
    ]).then(function(answers){
        var query = connection.query("SELECT * FROM products WHERE ?", {id: answers.id}, function(err,response){
            if(err) throw err;
            if(response.length === 0){
                console.log("\nResupply Failed, you must select a valid ID from the store display.")
                prompt();
            }
            else{
                var query = connection.query("UPDATE products SET stock = " + (response[0].stock + answers.quantity) + " WHERE id = " + answers.id, function(err,re){
                    console.log("Successfully added " + answers.quantity + " " + response[0].product + " to our inventory.")
                    console.log("We now have " + (response[0].stock + answers.quantity) + " " + response[0].product + " in stock.")
                })
            }
            connection.end();
        })
    })
}

var addProduct = function(){
    inquirer.prompt([{
        name: "product",
        type: "input",
        message: "What product would you like to add?"
    },{
        name: "department",
        type: "input",
        message: "What department should we put it in?"
    },{
        name: "price",
        type: "input",
        message: "What price should we set for this product?"
    },{
        name: "stock",
        type: "input",
        message: "How many would you like to order?",
        validate: function(value) {
            if (isNaN(value) ===  false && parseInt(value) > 0){
                return true;
            }
            else{
                console.log("Invalid Quantity (Must be at least 1).")
            }
        },
        filter: Number
    }]).then(function(answers){
        var query = connection.query("INSERT INTO products SET ?", {product:answers.product,department:answers.department,price:answers.price,stock:answers.stock},function(err,response){
            console.log("Successfully added " + answers.product + " to our inventory.")
            connection.end();
        })
    })
}


var prompt = function(){
    
    inquirer.prompt([{
        name: "choice",
        type: "list",
        message: "What would you like to do Mr. Manager?",
        choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product"]
    }]).then(function(answers){
        if (answers.choice === "View Products For Sale"){
            viewProduct();
        }
        else if(answers.choice === "View Low Inventory"){
            viewLowCall();
        }
        else if(answers.choice === "Add To Inventory"){
            addInventory();
        }
        else if(answers.choice === "Add New Product"){
            addProduct();
        }
    })
}

prompt();