var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon"
});

var prompt = function() {
    
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "What is the ID of the product you would like to buy?",
            validate: function(value) {
                if (isNaN(value) ===  false && parseInt(value) > 0){
                    return true;
                }
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to purchase?",
            validate: function(value) {
                if (isNaN(value) ===  false && parseInt(value) > 0){
                    return true;
                }
                else{
                    console.log("Invalid Quantity (Must be at least 1)")
                }
            }
        }
    ]).then(function(answers){

        var query = connection.query("SELECT * FROM products WHERE ?", {id: answers.id}, function(err,response){
            if(err) throw err;
            if(response.length === 0){
                console.log("\nPurchase Failed, you must select a valid ID from our store display.")
                start();
            }
            else if (answers.quantity <= response[0].stock){
                console.log("Purchase Successful, completing your order now...")

                var query = connection.query("UPDATE products SET stock = " + (response[0].stock - answers.quantity) + " WHERE id = " + answers.id, function(err,res){
                    if(err) throw err;
                    console.log("Order Complete, Your card has been charged for $" + (response[0].price * answers.quantity))
                    inquirer.prompt([{
                        name: "choice",
                        type: "list",
                        message: "Would you like to make another purchase?",
                        choices: ["Yes", "No"]
                    }
                    ]).then(function(ans){
                        if (ans.choice === "Yes"){
                            start();
                        }
                        else{
                            console.log("Thank you for visiting Bamazon, have a nice day!")
                        }
                    })
                })
            }
            else{
                console.log("\nPurchase Failed. There was not enough stock in our inventory to complete your order for " + answers.quantity + " " + response[0].product)
                console.log("We have " + response[0].stock + " " + response[0].product + " in stock.\n")
                start();
            }
        })
    })
    
}

var start = function() {
    var query = connection.query("SELECT * FROM products", function(err,response){
        if(err) throw err;
        console.log("")
        for(var i = 0; i < response.length; i++){
            console.log("---------------------------------------------------------------------------------------------------")
            console.log("ID: " + response[i].id + " || Product: " + response[i].product + " || Department: " + response[i].department + " || Price: " + response[i].price + " || In Stock: " + response[i].stock)
        }
        
    })
    prompt();
}

start();
