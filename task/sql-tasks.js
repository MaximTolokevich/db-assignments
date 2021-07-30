'use strict';

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of SQL functions and                      *
 * approaches to work with data in SQL.                                                     *
 * https://dev.mysql.com/doc/refman/5.7/en/function-reference.html                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations. If you see the SQL first time,     *
 * you can find explanation and some trainings at W3S                                       *
 * https://www.w3schools.com/sql/sql_syntax.asp                                             *
 *                                                                                          *
 ********************************************************************************************/


/**
 *  Create a SQL query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * @return {array}
 *
 */
async function task_1_1(db) {
    // The first task is example, please follow the style in the next functions.
    let result = await db.query(`
        SELECT
           EmployeeID as "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title as "Title",
           City as "City"
        FROM Employees
        ORDER BY City, "Employee Full Name"
    `);
    return result[0];
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES: Discount in OrderDetails is a discount($) per Unit.
 * @return {array}
 *
 */
async function task_1_2(db) {
    let result = await db.query(`
        SELECT
           OrderId as "Order Id",
           SUM(Quantity * UnitPrice) as "Order Total Price",
           ROUND(SUM(Quantity * Discount)/SUM(Quantity * UnitPrice) * 100,3) as "Total Order Discount, %"
        FROM OrderDetails
        GROUP BY OrderId
        ORDER BY OrderId DESC
    `);
    return result[0];
}

/**
 *  Create a query to return all customers from USA without Fax:
 * | CustomerId | CompanyName |
 *
 * @return {array}
 *
 */
async function task_1_3(db) {
    let result = await db.query(`
        SELECT
	        CustomerID as "CustomerId",
            CompanyName
        FROM Customers
        WHERE Country = "USA" AND Fax IS NULL ;
`);
    return result[0];
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * order data by % - higher percent at the top, then by CustomerID asc
 *
 * @return {array}
 *
 */
async function task_1_4(db) {
    let result = await db.query(`
        SELECT 
	       CustomerID as "Customer Id",
           count(OrderID) as "Total number of Orders",
           round(count(2)/(select count(CustomerID) from orders)*100.0 , 5) as"% of all orders"
	    from orders
        group by CustomerID
        order by 3 desc , CustomerID
`);
    return result[0];

}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductId | ProductName | QuantityPerUnit |
 *
 * @return {array}
 *
 */
async function task_1_5(db) {
    let result = await db.query(`
        SELECT 
           ProductId,
           ProductName,
           QuantityPerUnit
        FROM Products
        WHERE ProductName RLIKE '^[a-f]'
        ORDER BY ProductName;   
    `);
    return result[0];
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 * @return {array}
 *
 */
async function task_1_6(db) {
    let result = await db.query(`
        select
	       ProductName ,
           CategoryName,
           CompanyName as "SupplierCompanyName"
        from products 
        join categories on products.CategoryID = categories.CategoryID
        join suppliers on products.SupplierID = suppliers.SupplierID
        order by ProductName,CategoryName 
    `);
    return result[0];
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeId | FullName | ReportsTo |
 *
 * Order data by EmployeeId.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 * @return {array}
 *
 */
async function task_1_7(db) {
    let result = await db.query(`
        SELECT 
	       boss.EmployeeID as "EmployeeId",
           concat_ws(' ',boss.FirstName,boss.LastName) as "FullName",
           ifnull(concat(subordinate.FirstName,' ',subordinate.LastName),"-") as "ReportsTo"
	    from employees boss
        left join employees subordinate on boss.ReportsTo = subordinate.EmployeeID
        order by EmployeeID
`);
    return result[0];
}

/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 *
 * @return {array}
 *
 */
async function task_1_8(db) {
    let result = await db.query(`
        select 
	       categories.CategoryName ,
           count(*) as "TotalNumberOfProducts"
        from products
        left join categories on categories.CategoryID = products.CategoryID
        group by CategoryName
        order by CategoryName
`);
    return result[0];
}


/**
 *
 * Create a SQL query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 *
 * @return {array}
 *
 */
async function task_1_9(db) {
    let result = await db.query(`
        SELECT
           CustomerID,
           ContactName
        from customers
        where ContactName rlike '^F..n' 
`);
    return result[0];
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 *
 * @return {array}
 *
 */
async function task_1_10(db) {
    let result = await db.query(`
        SELECT
           products.ProductID,
           products.ProductName
        from products
        where Discontinued = 1;
`);
    return result[0];
}

/**
 * Create a SQL query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 *
 * @return {array}
 *
 */
async function task_1_11(db) {
    let result = await db.query(`
        SELECT 
	       ProductName,
           UnitPrice
        from products
        where UnitPrice between 5 and 15
        order by UnitPrice ,ProductName
`);
    return result[0];
}

/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price then by ProductName.
 *
 * @return {array}
 *
 */
async function task_1_12(db) {
    let result = await db.query(`
        SELECT *
           from
           (select
               ProductName,
               UnitPrice
            from products 
            order by UnitPrice desc limit 20) as qwe
        order by UnitPrice,ProductName
`);
    return result[0];
}

/**
 * Create a SQL query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * @return {array}
 *
 */
async function task_1_13(db) {
    let result = await db.query(`
        select 
	       count(*) as "TotalOfCurrentProducts",
           SUM(CASE WHEN Discontinued = 1 THEN 1 ELSE 0 END) as "TotalOfDiscontinuedProducts"
	    from products
`);
    return result[0];
}

/**
 * Create a SQL query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 *
 * @return {array}
 *
 */
async function task_1_14(db) {
    let result = await db.query(`
        SELECT
           ProductName,
           UnitsOnOrder,
           UnitsInStock
        from products
        where UnitsOnOrder > UnitsInStock
`);
    return result[0];
}

/**
 * Create a SQL query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * @return {array}
 *
 */
async function task_1_15(db) {
    let result = await db.query(`
        SELECT
           sum(month(OrderDate) = 1) as January,
           sum(month(OrderDate) = 2) as February,
           sum(month(OrderDate) = 3) as March,
           sum(month(OrderDate) = 4) as April,
           sum(month(OrderDate) = 5) as May,
           sum(month(OrderDate) = 6) as June,
           sum(month(OrderDate) = 7) as July,
           sum(month(OrderDate) = 8) as August,
           sum(month(OrderDate) = 9) as September,
           sum(month(OrderDate) = 10) as October,
           sum(month(OrderDate) = 11) as November,
           sum(month(OrderDate) = 12) as December
        from orders
        where year(OrderDate)=1997
`);
    return result[0];
}

/**
 * Create a SQL query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 *
 * @return {array}
 *
 */
async function task_1_16(db) {
    let result = await db.query(`
        SELECT
           OrderID,
           CustomerID,
           ShipCountry
        from orders
        where ShipPostalCode is not null
`);
    return result[0];
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 *
 * @return {array}
 *
 * Order by AvgPrice descending then by CategoryName
 *
 */
async function task_1_17(db) {
    let result = await db.query(`
        SELECT
           CategoryName,
           avg(UnitPrice) as "AvgPrice"
        from products left join categories on products.CategoryID = categories.CategoryID
        group by CategoryName
        order by avg(UnitPrice) desc
`);
    return result[0];
}

/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * OrderDate needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
    let result = await db.query(`
        SELECT
	       DATE_FORMAT(OrderDate, "%Y-%m-%d %T") as OrderDate,
           count(*) as "Total Number of Orders"
	    from orders
        where year(OrderDate)= 1998
        group by OrderDate
`);
    return result[0];
}

/**
 * Create a SQL query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 * @return {array}
 *
 */
async function task_1_19(db) {
    let result = await db.query(`
        select
           customers.CustomerID,
           CompanyName,
           sum(orderdetails.Quantity * orderdetails.UnitPrice) as "TotalOrdersAmount, $"
        from customers
        join orders  on customers.CustomerID = orders.CustomerID
        join orderdetails on orderdetails.OrderID = orders.OrderID
        group by CustomerID
        having sum(Quantity*UnitPrice)>10000
        order by sum(Quantity * UnitPrice) desc, CustomerID 
`);
    return result[0];
}

/**
 *
 * Create a SQL query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 *
 * @return {array}
 *
 */
async function task_1_20(db) {
    let result = await db.query(`
        SELECT
           employees.EmployeeID,
           concat(FirstName, " ", LastName) as "Employee Full Name",
           sum(Quantity * UnitPrice) as "Amount, $"
        from employees
        join orders on employees.EmployeeID = orders.EmployeeID
        join orderdetails on orders.OrderID = orderdetails.OrderID
        group by EmployeeID
        order by sum(Quantity * UnitPrice) desc
        limit 1;
`);
    return result[0];
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 *
 * @return {array}
 */
async function task_1_21(db) {
    let result = await db.query(`
        SELECT
           OrderID,
           sum(Quantity * UnitPrice) as "Maximum Purchase Amount, $"
        from orderdetails
        group by OrderID
        order by sum(Quantity * UnitPrice) desc
        limit 1
`);
    return result[0];
}

/**
 * Create a SQL query to display the name of each customer along with their most expensive purchased product:
 * | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 * @return {array}
 */
async function task_1_22(db) {
    let result = await db.query(`
        SELECT DISTINCT
           Customers.CompanyName,
           Products.ProductName,
           OrderDetails.UnitPrice AS PricePerItem
        FROM Customers
        JOIN Orders ON Customers.CustomerId = Orders.CustomerId
        JOIN OrderDetails ON Orders.OrderId = OrderDetails.OrderId
        JOIN Products ON OrderDetails.ProductId = Products.ProductId
        JOIN (
            SELECT
               Customers.CustomerId,
               MAX(OrderDetails.UnitPrice) AS PricePerItem
            FROM Customers
            JOIN Orders ON Customers.CustomerId = Orders.CustomerId
            JOIN OrderDetails ON Orders.OrderId = OrderDetails.OrderId
            GROUP BY CustomerId
        ) sub ON Customers.CustomerId = sub.CustomerId AND OrderDetails.UnitPrice = sub.PricePerItem
        ORDER BY PricePerItem DESC, CompanyName, ProductName
`);
    return result[0];
}

module.exports = {
    task_1_1: task_1_1,
    task_1_2: task_1_2,
    task_1_3: task_1_3,
    task_1_4: task_1_4,
    task_1_5: task_1_5,
    task_1_6: task_1_6,
    task_1_7: task_1_7,
    task_1_8: task_1_8,
    task_1_9: task_1_9,
    task_1_10: task_1_10,
    task_1_11: task_1_11,
    task_1_12: task_1_12,
    task_1_13: task_1_13,
    task_1_14: task_1_14,
    task_1_15: task_1_15,
    task_1_16: task_1_16,
    task_1_17: task_1_17,
    task_1_18: task_1_18,
    task_1_19: task_1_19,
    task_1_20: task_1_20,
    task_1_21: task_1_21,
    task_1_22: task_1_22
};
