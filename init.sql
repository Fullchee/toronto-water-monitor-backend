DROP TABLE IF EXISTS account_email;
DROP TABLE IF EXISTS account;

-- one account to many emails

CREATE TABLE account (
    account_number VARCHAR(30) PRIMARY KEY,
    
    last_name VARCHAR(255) NOT NULL,
    payment_method INT NOT NULL,
    postal_code VARCHAR(255) NOT NULL,
    threshold INT DEFAULT 3
);

CREATE TABLE account_email (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    account_number VARCHAR(30),
    
    FOREIGN KEY(account_number) REFERENCES account(account_number)
);

CREATE UNIQUE INDEX unique_account_email ON account_email(email, account_number);
