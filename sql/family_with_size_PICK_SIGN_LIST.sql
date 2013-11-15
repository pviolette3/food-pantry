SELECT c.CID, 
    CASE WHEN fam.family_size IS NOT NULL 
        THEN fam.family_size + 1 
        ELSE 1
    END AS Size, c.* FROM (SELECT c1.CID AS CID, COUNT(c1.CID) AS family_size FROM (SELECT c.CID AS CID FROM Client c, FamilyMember f where c.CID = f.ClientID) AS c1
GROUP BY CID) as fam RIGHT OUTER JOIN Client c ON fam.CID = c.CID;