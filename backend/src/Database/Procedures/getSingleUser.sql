CREATE OR ALTER PROCEDURE getOneMember(@member_id VARCHAR(100))
AS
BEGIN   
    SELECT * FROM  Members WHERE member_id = @member_id
END

