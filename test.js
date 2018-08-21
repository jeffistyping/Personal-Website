//NOTE: For debugging this code, use console.log  The output of this is sent to CloudWatch, so look there when testing

exports.handler = (event, context, callback) => {

  //Order of inp+uts: Name, Cost, Description, Date
  
  //Get the slot values and set them to variables
  var userInput = event.inputTranscript;
  var expenseName = event.currentIntent.slots.ExpenseName;
  var expenseCost = event.currentIntent.slots.Cost;
  var expenseDescription = event.currentIntent.slots.ExpenseDescription;
  var expenseDate = event.currentIntent.slots.ExpenseDate;
  
  //Create array for setting slots in Lex
  var slots = {
      "ExpenseName": expenseName,
      "Cost": expenseCost,
      "ExpenseDate": expenseDate,
      "ExpenseDescription": expenseDescription
  };
  
  //console.log("THIS IS EVENT: " + JSON.stringify(event));
  
  //This function sends messages to the user. The message type is what distinguishes the various kinds of messages
  function sendUserMessage(type, message, intentName, slots, slotToElicit, fulfillmentState) {
      switch (type) {
          
          case "ElicitIntent":
              callback(null, {
                  "dialogAction": {
                      "type": "ElicitIntent",
                      "message": {
                          "contentType": "PlainText",
                          "content": message
                      }
                  }
              });
              break;
              
              
          case "ElicitSlot":
              callback(null, {
                  "dialogAction": {
                      "type": "ElicitSlot",
                      
                      //This is the message that the chatBot will respond with
                      "message": {
                          "contentType": "PlainText",
                          "content": message
                      },
                      "intentName": intentName,
                      "slots": slots,
                      "slotToElicit": slotToElicit
                  }
              });
              break;
              
              
          case "Delegate":
              callback(null, {
                  "dialogAction": {
                      "type": "Delegate",
                      "slots": slots
                  }
              });
              break;
              
              
          case "Close":
              callback(null, {
                  "dialogAction": {
                      "type": "Close",

                      //This is what YOU are setting the fulfillment state to after
                      //verifying the user data
                      "fulfillmentState": fulfillmentState,

                      //This is the message that the chatBot will respond with
                      "message": {
                          "contentType": "PlainText",
                          "content": message
                      }
                  }
              });
              break;
          
      }
  }
  
  
  //If the user says "reset" or "cancel", end the intent and prompt for a new intent
  if(userInput == "reset" || userInput == "cancel") {
      var messageToSend = "Okay, conversation has been reset. Is there anything I can help you with?";
      sendUserMessage("ElicitIntent", messageToSend, null, null, null, null);
  }
  
  //The first input is the expenseName -> there isn't any verification for this; take all user input
  if(expenseName == null) {
      sendUserMessage("ElicitSlot", "What is the name of the expense?", "AddExpense", slots, "ExpenseName", null);
  }
  else { //If the user has entered the name of the expense
  
      if (expenseCost == null) { //If the user hasn't entered the cost, prompt for the cost
          sendUserMessage("ElicitSlot", "What was the cost of the expense?", "AddExpense", slots, "Cost", null);
      }
      else { //If the user has entered a cost
          
          //Test the user's cost to see if it matches the following regex
          var costPattern = new RegExp(/\d*\.{0,1}\d{1,2}/);
          var match = costPattern.exec(expenseCost);
          
          if(match == null) {  //if the user didn't input a valid cost
              
              var userMessage = "Sorry, that is not a valid cost. Please enter the cost of the expense: ";
              sendUserMessage("ElicitSlot", userMessage, "AddExpense", slots, "Cost", null);
          }
          else { //if the user entered a valid cost
              
              //if the user hasn't entered a description
              if (expenseDescription == null) {
                  
                  var newSlots = {
                      "ExpenseName": expenseName,
                      "Cost": match.toString(),
                      "ExpenseDate": expenseDate,
                      "ExpenseDescription": expenseDescription
                  };
                  
                  sendUserMessage("ElicitSlot", "Please enter a short description of the expense:", "AddExpense", newSlots, "ExpenseDescription", null);
              }
              else { //If the user has entered a description
                  
                  //This function adds a given number of days to a given date
                  function addDays(date, days) {
                      var result = new Date(date);
                      result.setDate(result.getDate() + days);
                      return result;
                  }
                  
                  if (expenseDate == null) { //If the user hasn't entered a date, prompt for a date
                      sendUserMessage("ElicitSlot", "Please enter the date of the expense:", "AddExpense", slots, "ExpenseDate", null);
                  }
                  else {
                      //Make a date object from the user-entered date. Get current date and tomorrow's date
                      var convertedExpenseDate = new Date(expenseDate);
                      var currentDate = new Date();
                      var oneDayAhead = addDays(currentDate, 1);
                      
                      //If the date the user entered is more than one day ahead of current date, prompt them for a valid date
                      if (convertedExpenseDate > oneDayAhead) {
                          sendUserMessage("ElicitSlot", "Sorry that is not a valid expense date. Please enter the date on which the expense occurred:", "AddExpense", slots, "ExpenseDate", null);
                      }
                      else { //If the user entered a valid date, leave the response to Lex
                          sendUserMessage("Delegate", null, null, slots, null, null);
                      }
                  }
              }
          }
      }
  }
};