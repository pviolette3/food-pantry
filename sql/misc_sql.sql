-- Bag name, # items, # clients
(SELECT bag_prod.BagName, bag_prod.num_items, COUNT(c.CID) FROM
    (((SELECT BagName, COUNT(ProductName) AS num_items FROM Holds GROUP BY BagName) AS bag_prod)
    LEFT OUTER JOIN Client c ON c.BagSignedup = bag_prod.BagName)
    GROUP BY bag_prod.BagName);

-- Total Products dropped off this month
(SELECT d.ProdName, SUM(d.Quantity) AS DropoffThisMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(CURDATE()) GROUP BY d.ProdName) 

(SELECT d.ProdName, SUM(d.Quantity) AS DropoffLastMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(ADDDATE(CURDATE(), INTERVAL -1 MONTH)) GROUP BY d.ProdName);


-- Total products picked up
( SELECT h.ProductName, SUM(h.CurrentMonthQuantity) AS UsedThisMonth, SUM(h.LastMonthQuantity) AS UsedLastMonth FROM Pickup p JOIN Holds h ON p.BagName = h.BagName GROUP BY h.ProductName );

-- Inventory = products dropped off - products picked up
SELECT added.ProdName, added.TotalAdded - gone.UsedThisMonth AS QuantityOnHand FROM (((SELECT d.ProdName, SUM(d.Quantity) AS TotalAdded FROM Dropoff d WHERE MONTH(d.Date) = MONTH(CURDATE()) GROUP BY d.ProdName) as added) JOIN (( SELECT h.ProductName, SUM(h.CurrentMonthQuantity) AS UsedThisMonth, SUM(h.LastMonthQuantity) AS UsedLastMonth FROM Pickup p JOIN Holds h ON p.BagName = h.BagName GROUP BY h.ProductName) as gone) ON added.ProdName = gone.ProductName);


SELECT week, 
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
GROUP BY Week;

SELECT coalesce(foj1.ProdName, foj2.ProdName) AS ProdName, coalesce( (((SELECT * FROM (((SELECT d.ProdName, SUM(d.Quantity) AS DropoffThisMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(CURDATE()) GROUP BY d.ProdName) as this)

LEFT OUTER JOIN
((SELECT d.ProdName AS FOJ1P, SUM(d.Quantity) AS DropoffLastMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(ADDDATE(CURDATE(), INTERVAL -1 MONTH)) GROUP BY d.ProdName)as last)
ON this.ProdName = last.ProdName
)) as foj1)
UNION
(SELECT * FROM (((SELECT d.ProdName, SUM(d.Quantity) AS DropoffThisMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(CURDATE()) GROUP BY d.ProdName) as this1)

RIGHT OUTER JOIN
(((SELECT d.ProdName, SUM(d.Quantity) AS DropoffLastMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(ADDDATE(CURDATE(), INTERVAL -1 MONTH)) GROUP BY d.ProdName)as last1)
ON this1.ProdName = last1.ProdName
)) as foj2));



(((SELECT * FROM (((SELECT d.ProdName, SUM(d.Quantity) AS DropoffThisMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(CURDATE()) GROUP BY d.ProdName) as this)
    LEFT OUTER JOIN
((SELECT d.ProdName AS FOJ1P, SUM(d.Quantity) AS DropoffLastMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(ADDDATE(CURDATE(), INTERVAL -1 MONTH)) GROUP BY d.ProdName)as last)
ON this.ProdName = last.ProdName
)) as foj1)
UNION
(SELECT * FROM (((SELECT d.ProdName, SUM(d.Quantity) AS DropoffThisMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(CURDATE()) GROUP BY d.ProdName) as this1)

RIGHT OUTER JOIN
(((SELECT d.ProdName, SUM(d.Quantity) AS DropoffLastMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(ADDDATE(CURDATE(), INTERVAL -1 MONTH)) GROUP BY d.ProdName)as last1)
ON this1.ProdName = last1.ProdName
) as foj2)));

SELECT * FROM ((((SELECT d.ProdName AS PN1A, SUM(d.Quantity) AS DropoffThisMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(CURDATE()) GROUP BY d.ProdName) as this)
LEFT OUTER JOIN
((SELECT d.ProdName AS PN1B, SUM(d.Quantity) AS DropoffLastMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(ADDDATE(CURDATE(), INTERVAL -1 MONTH)) GROUP BY d.ProdName)as last)
ON this.PN1A = last.PN1B) )

(SELECT * FROM ((((SELECT d.ProdName AS PN1A, SUM(d.Quantity) AS DropoffThisMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(CURDATE()) GROUP BY d.ProdName) as this)
LEFT OUTER JOIN
((SELECT d.ProdName AS PN1B, SUM(d.Quantity) AS DropoffLastMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(ADDDATE(CURDATE(), INTERVAL -1 MONTH)) GROUP BY d.ProdName)as last)
ON this.PN1A = last.PN1B) ))
UNION
(SELECT * FROM ((((SELECT d.ProdName AS PN1A, SUM(d.Quantity) AS DropoffThisMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(CURDATE()) GROUP BY d.ProdName) as this)
RIGHT OUTER JOIN
((SELECT d.ProdName AS PN1B, SUM(d.Quantity) AS DropoffLastMonth FROM Dropoff d WHERE MONTH(d.Date) = MONTH(ADDDATE(CURDATE(), INTERVAL -1 MONTH)) GROUP BY d.ProdName)as last)
ON this.PN1A = last.PN1B) ))