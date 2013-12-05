-- Products
INSERT INTO Product (Name, Cost, SourceName) VALUES ('pears', 1.00, 'walmart');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('chocolate', 1.20, 'Walmart');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Apples', 0.60, 'Costco');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Cereal', 0.20, 'Walgreens');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Rice', 0.60, 'Costco');

INSERT INTO Product (Name, Cost, SourceName) VALUES ('Ramen Noodles', 0.0001, 'Dillons');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Linguini', 0.50, 'Walmart' );
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Penne', 0.40, 'Walmart');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Macaroni', 0.30, 'Meijer');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Shells', 0.30, 'Meijer');

INSERT INTO Product (Name, Cost, SourceName) VALUES ('Bananas', 0.20, 'Kroger');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Oranges', 0.60, 'H Mart');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Mangos', 0.75, 'Kroger');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Strawberries', 1.00, 'Publix');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Blueberries', 1.20, 'Publix');

INSERT INTO Product (Name, Cost, SourceName) VALUES ('Milk', 1.20, 'Kroger');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Orange Juice', 3.20, 'Walmart');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Powerade', 1.00, 'Costco');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Gatorade', 1.05, 'Walmart');
INSERT INTO Product (Name, Cost, SourceName) VALUES ('Smart Water', 2.50, 'Whole Foods');

-- Dropoffs
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( CURDATE(), 'Pears', 30);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( CURDATE(), 'chocolate', 100);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( CURDATE(), 'Apples', 40);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( CURDATE(), 'rice', 101);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-10-30', 'rice', 101);

INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-10-30', 'Ramen noodles', 1000);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-10-30', 'Penne', 10);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-10-30', 'Linguini', 20);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-10-30', 'Macaroni', 30);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-10-30', 'Shells', 40);

INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-10-27', 'Bananas', 40);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-10-27', 'Oranges', 35);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-10-27', 'Mangos', 30);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-10-27', 'Strawberries', 45);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-10-27', 'Blueberries', 15);

INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-11-11', 'Milk', 300);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-11-11', 'Orange Juice', 275);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-11-11', 'Powerade', 165);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-11-11', 'Gatorade', 45);
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-11-11', 'Smart Water', 170);


-- Bag
INSERT INTO Bag (Name) VALUES ('Bag 1');
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES ( 'chocolate', 'bag 1', 10 );
INSERT INTO Holds (ProductName, BagName, CurrentMonthQuantity) VALUES ('pears', 'bag 1', 2);

INSERT INTO Bag (Name) VALUES ('Bag 2');
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity, LastMonthQuantity) VALUES ('apples', 'bag 2', 30, 3);
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity, LastMonthQuantity) VALUES ('rice', 'bag 2', 5, 2);
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity, LastMonthQuantity) VALUES ('chocolate', 'bag 2', 8, 6);

INSERT INTO Bag (Name) VALUES ('Bag 3');
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES ('Ramen Noodles', 'bag 3', 50);
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES ('Penne', 'bag 3', 2);
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES ('Linguini', 'bag 3', 7);

INSERT INTO Bag (Name) VALUES ('Bag 4');
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES ('Macaroni', 'bag 4', 11);
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES ('Shells', 'bag 4', 12);
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES ('Bananas', 'bag 4', 13);

INSERT INTO Bag (Name) VALUES ('Bag 5');
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES ('Oranges', 'bag 5', 31);
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES ('Mangos', 'bag 5', 23);
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES ('Strawberries', 'bag 5', 19);

INSERT INTO Bag (Name) VALUES ('Bag 6');
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES ('Blueberries', 'bag 6', 7);
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES ('Milk', 'bag 6', 90);
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES ('Orange Juice', 'bag 6', 14);


-- Client
INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Mary', 'Smith', '300 North Side Dr', 'Atlanta', 'GA', '30332', '4043351122', CURDATE(), 'Bag 1', 5, '1958-12-01');
INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Joe', 'Schmoe', '123 easy street', 'Menlo Park', 'CA', '12345', '1926874902', CURDATE(), 'Bag 1', 10, '1984-06-12');

INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Rita', 'Skeeter', 'Hogwarts', 'Manchester', 'EN', '81039', '5923048000', CURDATE(), 'Bag 2', 10, '1990-08-30');
INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Weasley', 'Arthur', 'The Burrow',  'Devon', 'EN', '80193', '3850382910', CURDATE(), 'Bag 2', 15, '1950-02-06');

INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Lovegood', 'Xenophilius', 'Ottery St. Catchpole', 'Devon', 'EN', '81039', '4730193847', CURDATE(), 'Bag 3', 20, '1950-11-21');
INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Lupin', 'Remus', 'Wolfshire Rue', 'London', 'EN', '01923', '8476525810', CURDATE(), 'BAG 3', 25, '1955-12-03');

INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Potter', 'James', 'Godric's Hollow', 'Surrey', 'EN', '39087', '6886532456', CURDATE(), 'BAG 4', 30, '1947-11-01');
INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Dursley', 'Vernon', '4 Privet Drive', 'Little Whinging', 'EN', '30298', '2819304765', CURDATE(), 'BAG 4', 2, '1963-11-16');


INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Wilkins', 'Wendell', '4290 Memory Lane', 'Sydney', 'AU', '38476', '0192387456', CURDATE(), 'BAG 5', 7, '1973-06-07');
INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Delacoeur', 'Fleur', 'Rue de Lilly', 'Paris', 'FR', '46296', '4673845906', CURDATE(), 'BAG 5', 12, '1977-07-07');


INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Diggory', 'Amos', 'Ottery St. Catchpole', 'Devon', 'EN', '81039', '7109287354', CURDATE(), 'BAG ', 17, '1958-01-09');
INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Dumbledore', 'Aberfoth', 'Hogshead Inn', 'Hogsmeade', 'EN', '52436', '2208897564', CURDATE(), 'BAG ', 22, '1879-03-03');

-- Family members
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Sue', 'Schmoe', 1, '2000-11-12', 'f');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Steve', 'Young', 1, '1990-03-14', 'm');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Molly', 'Weasley', 4, '1949-10-30', 'f');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Bill', 'Weasley', 4, '1970-11-29', 'm');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Charlie', 'Weasley', 4, '1972-12-12', 'm');

INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Percy', 'Weasley', 4, '1976-08-22', 'm');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Fred', 'Weasley', 4, '1978-04-01', 'm');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('George', 'Weasley', 4, '1978-04-01', 'm');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Ron', 'Weasley', 4, '1980-03-01', 'm');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Ginny', 'Weasley', 4, '1981-08-11', 'f');

INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Luna', 'Lovegood', 5, '1981-03-03', 'f');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Nymphadora', 'Lupin', 6, '1973-05-02', 'f');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Lily', 'Potter', 7, '1960-01-30', 'f');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Harry', 'Potter', 7, '1960-07-31', 'm');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Petunia', 'Dursley', 8, '1962-05-17', 'f');

INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Dudley', 'Dursley', '1980-06-23', 8, 'm');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Monica', 'Wilkins', '1963-08-14', 9,);
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Gabrielle', 'Delacour', 10, '1986-04-18', 'f');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Cedric', 'Diggory', 11, '1977-10-31', 'm');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES ('Albus', 'Dumbledore', 12, '1881-06-03', 'm');

-- Pickups
INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( '2013-10-5', 1, 'Bag 1');
INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( '2013-10-10', 2, 'Bag 1');
INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( '2013-10-10', 3, 'Bag 2');
INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( '2013-10-15', 4, 'Bag 2');
INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( '2013-10-20', 5, 'Bag 3');
INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( '2013-10-25', 6, 'Bag 3');

INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( '2013-10-30', 7, 'Bag 4');
INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( '2013-10-2', 8, 'Bag 4');
INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( '2013-10-7', 9, 'Bag 5');
INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( '2013-10-12', 10, 'Bag 5');
INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( '2013-10-15', 11, 'Bag 6');
INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( '2013-10-17', 12, 'Bag 6');


-- User
INSERT INTO User (UserName, Password, Type) VALUES ( 'steve' , '1234', 'v' );
INSERT INTO User (UserName, Password, Type) VALUES ( 'admin' , 'admin', 'd');


