-- Drop database if exists and create new one
DROP DATABASE IF EXISTS Employee_Directory;
CREATE DATABASE Employee_Directory;

-- Use the database
USE Employee_Directory;

-- Create Department table
CREATE TABLE Department (
    DepartmentID INT AUTO_INCREMENT PRIMARY KEY,
    DepartmentName VARCHAR(100) NOT NULL
);

-- Create Employee table
CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PhoneNumber VARCHAR(15),
    DOJ DATE NOT NULL,
    Designation VARCHAR(50) NOT NULL,
    DepartmentID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
);

-- Create Admin table
CREATE TABLE Admin (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL
);

-- Insert department data
INSERT INTO Department (DepartmentName) VALUES
('Human Resources'),
('Finance'),
('IT'),
('Marketing');

-- Insert employee data
INSERT INTO Employee (EmployeeID, FirstName, LastName, Email, PhoneNumber, DOJ, Designation, DepartmentID) VALUES
(2395520, 'Anish', 'Singh', 'anish.singh@cognizant.com', '1234567890', '2025-01-15', 'Trainee', 1),
(2395615, 'Nishita', 'Deo', 'nishita.deo@cognizant.com', '0987654321', '2025-02-20', 'Manager', 2),
(2395580, 'Aakanksha', 'Kashyap', 'aakanksha.kashyap@cognizant.com', '1122334455', '2024-03-10', 'Trainee', 4),
(2395531, 'Abhishek', 'Kumar', 'abhishek.kumar@cognizant.com', '5566778899', '2024-07-25', 'Designer', 4),
(2395581, 'Dhanjee', 'Tiwari', 'dhanjee.tiwari@cognizant.com', '5566778899', '2024-07-04', 'Developer', 3);

-- Insert admin data with plain text password '123'
INSERT INTO Admin (Username, Password) VALUES
('admin', '123');

-- Verify the data
SELECT * FROM Department;
SELECT * FROM Employee;
SELECT * FROM Admin;