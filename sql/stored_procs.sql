DELIMITER // -- allows semicolons in stored proc

CREATE PROCEDURE GetFamilyInfo()
    BEGIN
        SELECT 
        CASE WHEN fam.family_size IS NOT NULL 
            THEN fam.family_size + 1 
            ELSE 1
        END AS Size, c.* FROM (SELECT c1.CID AS CID, COUNT(c1.CID) AS family_size FROM (SELECT c.CID AS CID FROM Client c, FamilyMember f where c.CID = f.ClientID) AS c1
        GROUP BY CID) as fam RIGHT OUTER JOIN Client c ON fam.CID = c.CID;
    END //

CREATE PROCEDURE GetPickupSignIn(IN Day tinyint)
	BEGIN 
		SELECT c.CID,
			CASE WHEN fam.family_size IS NOT NULL
				THEN fam.family_size + 1
				ELSE 1
			END AS Size, c.* FROM (SELECT c1.CID AS CID, COUNT(c1.CID) AS family_size FROM (SELECT c.CID AS CID FROM Client c, FamilyMember f where c.CID = f.ClientID) AS c1
		GROUP BY CID) as fam RIGHT OUTER JOIN Client c ON fam.CID = c.CID WHERE c.PickupDay = Day;	
	END //
	
CREATE PROCEDURE GetHungerReliefBagList()
	BEGIN
		(SELECT bag_prod.BagName, bag_prod.num_items, COUNT(c.CID) FROM
			(((SELECT BagName, COUNT(ProductName) 
			AS num_items 
			FROM Holds 
			GROUP BY BagName) 
			AS bag_prod)
			LEFT OUTER JOIN Client c ON c.BagSignedup = bag_prod.BagName)
	GROUP BY bag_prod.BagName);
	END //
	
	
CREATE PROCEDURE GetFamilyInfoByPickupDay(IN Day tinyint)
    BEGIN
      SELECT * FROM ((SELECT CASE WHEN fam.family_size IS NOT NULL 
            THEN fam.family_size + 1 
            ELSE 1
        END AS Size, c.* FROM (SELECT c1.CID AS CID, COUNT(c1.CID) AS family_size FROM (SELECT c.CID AS CID FROM Client c, FamilyMember f where c.CID = f.ClientID) AS c1
        GROUP BY CID) as fam RIGHT OUTER JOIN Client c ON fam.CID = c.CID) as f) WHERE f.PickupDay = Day;
    END //

CREATE PROCEDURE GetFamilyInfoBySearch(IN LastNameSearch varchar(32), IN PhoneSearch varchar(32))
    BEGIN
        DECLARE PhoneWildcard varchar(32) DEFAULT '';
        DECLARE LastNameWildcard varchar(32) DEFAULT '';

        SELECT IF(STRCMP(PhoneSearch, ''), CONCAT('%', PhoneSearch, '%'), '') INTO PhoneWildcard;
        SELECT IF(STRCMP(LastNameSearch, ''), CONCAT('%', LastNameSearch, '%'), '') INTO LastNameWildcard;

        SELECT * FROM ((SELECT CASE WHEN fam.family_size IS NOT NULL 
            THEN fam.family_size + 1 
            ELSE 1
        END AS Size, c.* FROM (SELECT c1.CID AS CID, COUNT(c1.CID) AS family_size FROM (SELECT c.CID AS CID FROM Client c, FamilyMember f where c.CID = f.ClientID) AS c1
        GROUP BY CID) as fam RIGHT OUTER JOIN Client c ON fam.CID = c.CID) as f)
            WHERE f.LastName LIKE LastNameWildcard OR f.Phone LIKE PhoneWildcard;
    END //

CREATE PROCEDURE GetBagInfoForClient(IN FirstName varchar(32), IN LastName varchar(32), IN Phone varchar(11))
    BEGIN
        DECLARE ClientID int DEFAULT -1;
        SELECT CID INTO ClientID FROM Client c where c.FirstName = FirstName AND c.LastName = LastName AND c.Phone = Phone;
        SELECT h.ProductName, h.CurrentMonthQuantity, c.CID, c.BagSignedUp FROM Holds h, Client c 
            WHERE h.BagName = (SELECT BagSignedUp FROM Client c WHERE c.CID = ClientID) AND c.CID = ClientID;
    END //

CREATE PROCEDURE GetProductList()
    BEGIN -- Gives Product List (ProdName, Quantity, Cost per unit)
       SELECT p.Name, p.Cost, prod_qty.QuantityOnHand FROM 
       (
            (SELECT added.ProdName, added.TotalAdded - gone.UsedThisMonth AS QuantityOnHand FROM (
                ((SELECT d.ProdName, SUM(d.Quantity) AS TotalAdded FROM Dropoff d 
                    WHERE MONTH(d.Date) = MONTH(CURDATE()) GROUP BY d.ProdName) as added) 
                JOIN (
                ( SELECT h.ProductName, SUM(h.CurrentMonthQuantity) AS UsedThisMonth, 
                    SUM(h.LastMonthQuantity) AS UsedLastMonth FROM Pickup p JOIN Holds h ON p.BagName = h.BagName 
                    GROUP BY h.ProductName) as gone) ON added.ProdName = gone.ProductName)) as prod_qty)
        JOIN
        ((SELECT Name, Cost FROM Product) as p)
        ON p.Name = prod_qty.ProdName;
    END //
	
CREATE PROCEDURE GetMonthlyServiceReport(IN thisMonth BOOLEAN)
	BEGIN
		CREATE TEMPORARY TABLE WeekBags AS SELECT CASE WHEN PickupDay < 7 THEN 1
			WHEN PickupDay < 14 THEN 2
				WHEN PickupDay < 21 THEN 3
				WHEN PickupDay < 28 THEN 4
				ELSE 5
			END AS Week, BagSignedUp FROM Client;
		IF thisMonth THEN
			CREATE TEMPORARY TABLE WeekProducts AS (SELECT Week, ProductName, CurrentMonthQuantity AS Quantity FROM (WeekBags w JOIN Holds h ON w.BagSignedUp = h.BagName));
		ELSE
			CREATE TEMPORARY TABLE WeekProducts AS (SELECT Week, ProductName, LastMonthQuantity AS Quantity FROM (WeekBags w JOIN Holds h ON w.BagSignedUp = h.BagName));
		END IF;
		
		CREATE TEMPORARY TABLE WeekFoodCosts SELECT Week, SUM(Quantity * Cost) AS FoodCost FROM (WeekProducts wp JOIN Product p ON wp.ProductName = p.Name) GROUP BY Week;

		CREATE TEMPORARY TABLE WeekCategories AS (SELECT Week,
			COUNT(DISTINCT CID) AS Households,
			SUM(UnderEighteen) AS UnderEighteen,
			SUM(EighteenToSixtyFour) AS EighteenToSixtyFour,
					SUM(SixtyFiveAndUp) AS SixtyFiveAndUp,
					COUNT(*) AS TotalPeople FROM ((SELECT CID,
			CASE WHEN age BETWEEN 0 AND 18 THEN 1 ELSE 0 END AS UnderEighteen,
			CASE WHEN age BETWEEN 19 AND 64 THEN 1 ELSE 0 END AS EighteenToSixtyFour,
			CASE WHEN age > 65 THEN 1 ELSE 0 END AS SixtyFiveAndUp,

		  CASE WHEN PickupDay < 7 THEN 1
			WHEN PickupDay < 14 THEN 2
				WHEN PickupDay < 21 THEN 3
				WHEN PickupDay < 28 THEN 4
				ELSE 5
			END AS Week
					 
			FROM (((SELECT ClientID AS CID, DATEDIFF(CURDATE(), dob) / 365.25 as age FROM FamilyMember)
			UNION
			(SELECT CID, DATEDIFF(CURDATE(), dob) / 365.25 as age FROM Client)) as ages) NATURAL JOIN Client) as cat)
			GROUP BY Week);

			SELECT * FROM WeekCategories wc LEFT JOIN WeekFoodCosts wf ON wc.Week = wf.Week;
	END//

-- The beginning of hell, mysql does not support FULL OUTER JOIN. Here ya go
CREATE PROCEDURE GetGroceryList()
    BEGIN
        SELECT COALESCE(PN1A, PN1B) AS ProdName, COALESCE(DropoffThisMonth, 0) AS DropoffThisMonth, COALESCE(DropoffLastMonth, 0) AS DropoffLastMonth 
        FROM (((SELECT * FROM ((((SELECT d.ProdName AS PN1A, SUM(d.Quantity) AS DropoffThisMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(CURDATE()) GROUP BY d.ProdName) as this)
        LEFT OUTER JOIN
        ((SELECT d.ProdName AS PN1B, SUM(d.Quantity) AS DropoffLastMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(ADDDATE(CURDATE(), INTERVAL -1 MONTH)) GROUP BY d.ProdName)as last)
        ON this.PN1A = last.PN1B) ))
        UNION
        (SELECT * FROM ((((SELECT d.ProdName AS PN1A, SUM(d.Quantity) AS DropoffThisMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(CURDATE()) GROUP BY d.ProdName) as this)
        RIGHT OUTER JOIN
        ((SELECT d.ProdName AS PN1B, SUM(d.Quantity) AS DropoffLastMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(ADDDATE(CURDATE(), INTERVAL -1 MONTH)) GROUP BY d.ProdName)as last)
        ON this.PN1A = last.PN1B) )) ) as foj); -- Crying
    END //

DELIMITER ;