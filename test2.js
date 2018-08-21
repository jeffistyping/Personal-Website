//This function is called when the Add Expense Intent is ready to be fulfilled, which is after all of the slots have been filled.
//See the associated Lambda function called "AddExpenseVerification" for more information

//For the add expense intent, a new row should be added in the Expenses table with the following information:
//Name: expenseName that the user entered
//Cost: expenseCost that the user entered
//Description: expenseDescription that the user entered
//Date: expenseDate that user entered
//OwnedBy: the employee ID of the employee who created the expense
//Created: the date on which the expense was created
//Modified: the last date on which the expense record was modified - in this case, today
//Active: Set to "1" which indicates that the expense is currently active
//CurrentApprover: the id of the employee assigned to approve of the expense
//ALL OTHER COLUMNS SHOULD BE SET TO NULL

//need mysql connection to query databases

exports.handler = (event, context, callback) => {

    var mysql = require('mysql');

        //Make a new SQL connection
        //MAKE SURE YOU REMOVE THE CREDENTIAL INFORMATION HERE!!!!
        var con = mysql.createConnection({
            //host: "chatbot-dev.cbtga4o6fi13.us-east-1.rds.amazonaws.com",
            //user: "Lincoln",
            //password: "lincolnlo",
            //database: "ChatBotDevDb",
            //port: 3306
            
            host: event.sessionAttributes.dbHost,
            user: event.sessionAttributes.dbUserName,
            password: event.sessionAttributes.dbPassword,
            database: event.sessionAttributes.dbName,
            port: 3306
        });
        
        context.callbackWaitsForEmptyEventLoop = false;
        
        //Connect to the database
        con.connect(function(err) {  //If the connection failed
            
            if (err) {
                callback(null, {
                    "dialogAction": {
                        "type": "Close",

                        //This is what YOU are setting the fulfillment state to after
                        //verifying the user data
                        "fulfillmentState": "Fulfilled",

                        //This is the message that the chatBot will respond with
                        "message": {
                            "contentType": "PlainText",
                            "content": "Connection Error: " + err.stack
                        }
                    }
                });
            }
            else { //If the connection was successful
            
                //Get date-time info for creation time
                var today = new Date();
                var date = today.getDate();
                var month = today.getMonth() + 1;
                var year = today.getFullYear();
                var hour = today.getHours();
                var minute = today.getMinutes();
                var seconds = today.getSeconds();
                
                
                if (date < 10) {
                	date = '0' + date;
                }
                
                if (month < 10) {
                	month = '0' + month;
                }
                
                today = year + '-' + month + '-' + date + " " + hour + ":" + minute + ":" + seconds;
                
                //variable to contain the unique id for each expense
                var expenseNumber;
                
                //The data to be added to the database
                let payload = {
                    Name: event.currentIntent.slots.ExpenseName,
                    Cost: event.currentIntent.slots.Cost,
                    Description: event.currentIntent.slots.ExpenseDescription,
                    Date: event.currentIntent.slots.ExpenseDate,
                    Created: today,
                    Modified: today,
                    Active: 1
                };
                
                context.callbackWaitsForEmptyEventLoop = false;
                con.query("INSERT INTO Expenses SET ?", payload, function(err, result) {
                    //If there was an error with the query
                    if (err) {
                        callback(null, {
                            "dialogAction": {
                                "type": "Close",
        
                                //This is what YOU are setting the fulfillment state to after
                                //verifying the user data
                                "fulfillmentState": "Fulfilled",
        
                                //This is the message that the chatBot will respond with
                                "message": {
                                    "contentType": "PlainText",
                                    "content": "Query Error: " + err
                                }
                            }
                        });
                    }
                    else { //If the query was successful
                        
                        context.callbackWaitsForEmptyEventLoop = false;
                        con.query("SELECT LAST_INSERT_ID() AS lastid", function(error, results) {
                            
                            //If the query failed
                            if (error) {
                                callback(null, {
                                    "dialogAction": {
                                        "type": "Close",
                
                                        //This is what YOU are setting the fulfillment state to after
                                        //verifying the user data
                                        "fulfillmentState": "Fulfilled",
                
                                        //This is the message that the chatBot will respond with
                                        "message": {
                                            "contentType": "PlainText",
                                            "content": "Query Error: " + err
                                        }
                                    }
                                });
                            }
                            else { //If the query was successful
                            
                                //Set the expense number
                                expenseNumber = results[0].lastid;
                                
                                //FOR DEBUGGING PURPOSES -> CHECK CLOUDWATCH LOGS FOR THIS OUTPUT
                                //console.log(expenseNumber);
                                
                                
                                //Let the user know that the expense was successfully added
                                callback(null, {
                                    "dialogAction": {
                                        "type": "Close",
                
                                        //This is what YOU are setting the fulfillment state to after
                                        //verifying the user data
                                        "fulfillmentState": "Fulfilled",
                
                                        //This is the message that the chatBot will respond with
                                        "message": {
                                            "contentType": "PlainText",
                                            "content": 'Expense number ' + expenseNumber + ' was added. Is there anything else you would like to do?'
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }

        });

};