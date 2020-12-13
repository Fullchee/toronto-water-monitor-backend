DROP TABLE IF EXISTS account;

CREATE TABLE account (
    accountNumber varchar(30) PRIMARY KEY,
    
    email VARCHAR(255) NOT NULL,
    lastName varchar(255) NOT NULL,
    paymentMethod int NOT NULL,
    postalCode VARCHAR(255) NOT NULL
);
