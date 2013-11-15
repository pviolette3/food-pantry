-- Products
INSERT INTO Product (Name, Cost, SourceName) VALUES ('pears', 1.00, 'walmart');

INSERT INTO Product (Name, Cost, SourceName) VALUES ( 'chocolate', 1.20, 'Walmart' );

INSERT INTO Product (Name, Cost, SourceName) VALUES ( 'Apples', 0.60, 'Costco' );
INSERT INTO Product (Name, Cost, SourceName) VALUES ( 'Cereal', 0.20, 'Walgreens' );
INSERT INTO Product (Name, Cost, SourceName) VALUES ( 'Rice', 0.60, 'Costco' );
INSERT INTO Product (Name, Cost, SourceName) VALUES ( 'Ramen Noodles', 0.0001, 'Dillons' );


-- Dropoffs
INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( CURDATE(), 'Pears', 30);

INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( CURDATE(), 'chocolate', 100);

INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( CURDATE(), 'Apples', 40);

INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( CURDATE(), 'rice', 101);

INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-10-30', 'rice', 101);

INSERT INTO Dropoff (Date, ProdName, Quantity) VALUES ( '2013-10-30', 'Ramen noodles', 1000);


-- Bag
INSERT INTO Bag (Name) VALUES (  'Bag 1' );
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES
( 'chocolate', 'bag 1', 10 );
INSERT INTO Holds (ProductName, BagName, CurrentMonthQuantity) VALUES
('pears', 'bag 1', 2);

INSERT INTO Bag (Name) VALUES ('Bag 2');
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity, LastMonthQuantity) VALUES
('apples', 'bag 2', 30, 3);
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity, LastMonthQuantity) VALUES
('rice', 'bag 2', 5, 2);
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity, LastMonthQuantity) VALUES
('chocolate', 'bag 2', 8, 6);

INSERT INTO Bag (Name) VALUES ('Bag 3');
INSERT INTO Holds (ProductName, BagName,  CurrentMonthQuantity) VALUES
('Ramen Noodles', 'bag 3', 50);

-- Client
INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Mary', 'Smith', '300 North Side Dr', 'Atlanta', 'GA', '30332', '4043351122', CURDATE(), 'Bag 1', 5, '1958-12-01');

INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Joe', 'Schmoe', '123 easy street', 'Menlo Park', 'CA', '12345', '1926874902', CURDATE(), 'Bag 1', 10, '1984-06-12');

INSERT INTO Client (FirstName, LastName, Street, City, State, Zip, Phone, Start, BagSignedUp, PickupDay, DOB)
VALUES ('Rita', 'Skeeter', 'Hogwarts', 'Manchester', 'EN', '81039', '5923048000', CURDATE(), 'Bag 2', 10, '1990-08-30');


-- Family members
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES (
  'Sue', 'Schmoe', 1, '2000-11-12', 'f');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES (
  'Grandma', 'Lili', 1, '1944-02-06', 'f');
INSERT INTO FamilyMember (FirstName, LastName, ClientID, DOB, Gender) VALUES (
  'Steve', 'Young', 1, '1990-03-14', 'm');


-- Pickups
INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( CURDATE(), 3, 'Bag 2');
INSERT INTO Pickup (Date, ClientID, BagName) VALUES ( '2013-10-30', 1, 'Bag 1');


-- User
INSERT INTO User (UserName, Password, Type) VALUES ( 'steve' , '1234', 'v' );
INSERT INTO User (UserName, Password, Type) VALUES ( 'admin' , 'admin', 'd');


