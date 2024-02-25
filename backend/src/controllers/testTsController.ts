import mssql from 'mssql';
import { testInterface } from '../Interfaces/testInterface'; 
import { sqlConfig } from '../sqlConfig/userConfig'; 
import { Request, Response } from 'express'; 
import { v4 } from 'uuid'
import bcrypt from 'bcrypt';


export const registerUser = async (req: Request, res: Response) => {
    try{
        const { cohort_no, firstName, lastName, email, password }: testInterface = req.body;
        const id = v4();

        const hashPwd = await bcrypt.hash(password, 8);
    
        if (!password) {
            return res.status(400).json({error: "Password not detected"})
        }

        const emailValidate = /^[a-zA-Z]+[.][a-zA-Z]+@thejitu\.com$/;
        if (!emailValidate.test(email)) {
            return res.status(400).json({ error: 'Invalid email format. Email must be in the format: fname.lname@thejitu.com' });
        }

        const memberEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@thejitu.com`;

        const pool = await mssql.connect(sqlConfig);
        const newUser = (await pool.request()
            .input("member_id", mssql.VarChar, id)
            .input("cohort_no", mssql.VarChar, cohort_no)
            .input("firstName", mssql.VarChar, firstName)
            .input("lastName", mssql.VarChar, lastName)
            .input("email", mssql.VarChar, memberEmail)
            .input("password", mssql.VarChar, hashPwd)
            .execute('registerUSer')
        ).rowsAffected;

        if (newUser) {
            return res.json({ message: "Account created successfully" });
        } else {
            return res.json({ error: "An error occurred while creating Account." });
        }
    } catch (error) {
        return res.json({ error: "The user account was not created." });
    }

    }

export const getAllUsers = async (req: Request, res: Response) => {
        try {
            const pool = await mssql.connect(sqlConfig);
            const result = await pool.request().query('SELECT * FROM Members');
            res.json({ users: result.recordset });
        } catch (error) {
            console.error("Error fetching all members:", error);
            return res.status(500).json({ error: "An error occurred while fetching all members." });
        }
    };

export const getOneUser = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
    
            const pool = await mssql.connect(sqlConfig);
    
            const result = await pool
                .request()
                .input("member_id", mssql.VarChar, id)
                
                .query('SELECT * FROM Members WHERE member_id = @member_id'); 
    
            if (result.recordset.length === 0) {
                return res.status(404).json({ error: "Member not found" });
            }
    
            return res.json({ user: result.recordset[0] });
        } catch (error) {
            console.error("Error fetching one member:", error);
            return res.status(500).json({ error: "An error occurred while fetching one member." });
        }
    };
    

export const deleteUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const pool = await mssql.connect(sqlConfig);
            let result = (await pool.request()
            .input("member_id", mssql.VarChar, id)
            .query('DELETE FROM Members WHERE member_id = @member_id')
            ).rowsAffected
    
            console.log(result[0]);
            
            if(result[0] == 0){
                return res.status(201).json({
                    error: "User not found"
                })
            }else{
                return res.status(200).json({
                    message: "Account deleted successfully"
                })
            }
        }
    
        catch (error) {
            return res.json({error})
        }
    };
    
export const updateMember = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
    
            const { cohort_no, firstName, lastName, email, password }: testInterface = req.body;
            
           
            const hashPwd = await bcrypt.hash(password, 6);
    
            if (!password) {
                return res.status(400).json({ error: "Password is required" });
            }
            const pool = await mssql.connect(sqlConfig);
            const result = await pool.request()
                .input("member_id", mssql.VarChar, id)
                .input("cohort_no", mssql.VarChar, cohort_no)
                .input("firstName", mssql.VarChar, firstName)
                .input("lastName", mssql.VarChar, lastName)
                .input("email", mssql.VarChar, email)
                .input("password", mssql.VarChar, hashPwd)
                .execute('updateUser');
    
                console.log(result);
                
            const rowsAffected = result.rowsAffected[0];
    
            if (rowsAffected > 0) {
                return res.status(200).json({
                    message: "User updated successfully"
                });
            } else {
                return res.status(404).json({
                    error: "User not found or no changes were made"
                });
            }
        } catch (error) {
            console.error("Error updating user:", error);
            return res.status(500).json({ error: "An error occurred while updating user" });
        }
    };



