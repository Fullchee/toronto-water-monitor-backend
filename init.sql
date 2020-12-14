DROP TABLE IF EXISTS account;

CREATE TABLE account (
    account_number varchar(30) PRIMARY KEY,
    
    email VARCHAR(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    payment_method int NOT NULL,
    postal_code VARCHAR(255) NOT NULL,
    threshold int DEFAULT 3
);
