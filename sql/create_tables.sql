CREATE TABLE User
(
UserName varchar(32) PRIMARY KEY,
FirstName varchar(32),
LastName varchar(32),
Password varchar(32) NOT NULL,
Email varchar(32),
Type char(1) CHECK (Type IS NOT NULL AND Type IN ( ’d’, ‘v’))
);

CREATE TABLE Bag
(
  Name varchar(32) PRIMARY KEY
-- Clients (virtual) and Items (virtual), cost (virtual)
);

CREATE TABLE Client
(
  CID int auto_increment PRIMARY KEY,
  BagSignedUp varchar(32) NOT NULL,
      FirstName varchar(32) NOT NULL,
  LastName varchar(32) NOT NULL,
  Phone varchar(11) NOT NULL,
  UNIQUE( FirstName, LastName, Phone),
  Street varchar(32),
  City varchar(32),
  State varchar(32),
  Zip varchar(11),
  Apt varchar(32),

  Gender char(1) CHECK (Gender = ‘m’ or Gender = ‘f’),
  DOB date NOT NULL,
  Start date NOT NULL,
  PickupDay tinyint CHECK (PickupDay IS NOT NULL AND PickupDay >= 1 AND PickupDay <= 31),
  FOREIGN KEY (BagSignedUp) REFERENCES Bag(Name)
);



CREATE TABLE FamilyMember
(
  FirstName varchar(32) NOT NULL,
  LastName varchar(32) NOT NULL,
  ClientID int NOT NULL,
  DOB date,
  Gender char(1) CHECK (Gender IN (‘m’, ‘f’)),
  PRIMARY KEY (ClientID, FirstName, LastName),
  FOREIGN KEY (ClientID) REFERENCES Client(CID)
);

CREATE TABLE FinancialAid
(
  Name varchar(32) PRIMARY KEY,
  Type char(1) CHECK (Type IN ( ’f’, ‘s’))
);


CREATE TABLE HasAid
(
  CID int NOT NULL,
  FinAidName char(32) NOT NULL,
  FOREIGN KEY (CID) REFERENCES Client(CID),
  FOREIGN KEY (FinAidName) REFERENCES FinancialAid(Name),
  PRIMARY KEY (CID, FinAidName)
);

CREATE TABLE Product
(
  Name varchar(32) PRIMARY KEY,
  Cost float,
  SourceName varchar(32) NOT NULL
  -- Holds relation through selecting from holds table
);

CREATE TABLE Holds
(
  ProductName varchar(32) NOT NULL,
  BagName varchar(32) NOT NULL,
  CurrentMonthQuantity int DEFAULT 0,
  LastMonthQuantity int DEFAULT 0,
  PRIMARY KEY (ProductName, BagName),
  FOREIGN KEY (ProductName) REFERENCES Product(Name),
  FOREIGN KEY (BagName) REFERENCES Bag(Name)
);


CREATE TABLE Pickup
(
  ClientID int NOT NULL,
  BagName varchar(32) NOT NULL,
  Date date NOT NULL,
  PRIMARY KEY (ClientID, BagName),
  FOREIGN KEY (BagName) REFERENCES Bag(Name),
  FOREIGN KEY (ClientID) REFERENCES Client(CID)
);

CREATE TABLE Dropoff
(
  DropoffID int AUTO_INCREMENT NOT NULL,
  Date date NOT NULL,
  ProdName varchar(32) NOT NULL,
  FOREIGN KEY (ProdName) REFERENCES Product(Name),
  Quantity int CHECK (Quantity IS NOT NULL AND Quantity > 0) ,
  PRIMARY KEY (DropoffID)
);

CREATE VIEW ClientAge AS SELECT CID, DATEDIFF(CURDATE(), dob) / 365.25 as age FROM Client;
CREATE VIEW FamilyMemberAge AS SELECT ClientID AS CID, DATEDIFF(CURDATE(), dob) / 365.25 as age FROM FamilyMember;