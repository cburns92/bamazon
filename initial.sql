DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;


CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product VARCHAR(45) NULL,
  department VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock INTEGER(10) NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product,department,price,stock)
VALUES ("4K TV", "Electronics",399.99,5),("Cat Tree","Pet Supplies",64.99,10)

USE bamazon;
SELECT * FROM products