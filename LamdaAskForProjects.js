exports.handler = (event, context, callback) => {

    event.sessionAttributes['repeat'] = true;
    console.log("This is the session attribute" + event.sessionAttributes['repeat']);
    //Get the slot values and set them to variables
    let userInput = event.inputTranscript;
    let LanguageType = event.currentIntent.slots.Language;

    //Create array for setting slots in Lex
    let slots = {
        "Language": LanguageType,
    };

    console.log("THIS IS EVENT: " + JSON.stringify(event));

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

            case "ConfirmIntent":
                callback(null, {
                    "dialogAction": {
                        "type": "ElicitSlot",
                        "message": {
                            "contentType": "PlainText",
                            "content": message
                        },
                        "intentName": intentName,
                        "slots": slots,
                    }
                });
                break;

            case "Close":
                callback(null, {
                    "dialogAction": {
                        "type": "Close",
                        "fulfillmentState": "Fulfilled",
                        "message": {
                            "contentType": "PlainText",
                            "content": message
                        }
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

        }
    }


    if (userInput == "reset" || userInput == "cancel") {
        var messageToSend = "Okay, conversation has been reset. Is there anything I can help you with?";
        sendUserMessage("ElicitIntent", messageToSend, null, null, null, null);
    }
    let repeat = true;
    if (LanguageType == null && event.sessionAttributes['repeat']) {
        let response = "I have done lots of projects! Ask me about a language that you want to learn more about!"
        sendUserMessage("ElicitSlot", response, "Projects", slots, "Language", null);
    } else {
        if (LanguageType == "node" || LanguageType == "javascript" || LanguageType == "node.js") {
            console.log("in Node");
            let response = "I have built a Data-Integration software which allow multiple users to automatically pull data from 10+ services like SalesForce, Quickbooks, Xero and gather all the information into a single database which can then be analyze. I have also built a system to allow for users to seamlessly Authorize with Oauth2.0."
            event.sessionAttributes['repeat'] = false;
            console.log("In here should be false now " + event.sessionAttributes['repeat']);
            sendUserMessage("ElicitSlot", response, "Projects", slots, "Language", null);
        } else {
            let userMessage = "Sorry, Looks like I haven't done a project with that language yet! However, Please feel free to checkout my github for all the other projects: https://github.com/Lincoln23 ";
            sendUserMessage("Close", userMessage, "Projects", slots, "Language", null);
        }
    }

};