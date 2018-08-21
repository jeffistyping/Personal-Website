exports.handler = (event, context, callback) => {

    event.sessionAttributes['repeat'] = true;
    //Get the slot values and set them to variables
    let userInput = event.inputTranscript;
    let LanguageType = event.currentIntent.slots.Language;

    //Create array for setting slots in Lex
    let slots = {
        "Language": LanguageType,
    };

    console.log("THIS IS EVENT: " + JSON.stringify(event));
    console.log("THIS IS CONTEXT: " + JSON.stringify(context));

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
                        "slots": slots,
                    }
                });
                break;

        }
    }

    function languageValidate(input) {
        let matchLanguage = new RegExp('javascript|node\\.js|node|HTML|html|css|CSS|Bootstrap|bootstrap|Java|java|C\\+\\+|c\\+\\+|Android|android|PHP|php');
        let match = matchLanguage.exec(input);
        if (match == null) {
            return null;
        } else {
            return "success";
        }
    }

    if (userInput == "reset" || userInput == "cancel") {
        sendUserMessage("Delegate", null, null, slots, null, null);
    }

    if (event.sessionAttributes['repeat'] && LanguageType == null) {
        let response = "I have done lots of projects! Discover some of my project by asking me a particular programming language";
        sendUserMessage("ElicitSlot", response, "Projects", slots, "Language", null);
    }else {
        let string = event.inputTranscript
        console.log(string);
        console.log("See if comparison works"+ string.includes("node"));
        if(string.includes("node")){
            LanguageType = "node"
            let response = "I have built a Data-Integration software which allow multiple users to automatically pull data from 10+ services like SalesForce, Quickbooks, Xero and gather all the information into a single database which can then be analyze. I have also built a system to allow for users to seamlessly Authorize with Oauth2.0. \n\n Ask me about another language or quit by typing cancel"
            event.sessionAttributes['repeat'] = false;
            sendUserMessage("ElicitSlot", response, "Projects", slots, "Language", null);
        } else {
            let userMessage = "Sorry, Looks like I haven't done a project with that language yet! However, Please feel free to checkout my github for all the other projects: https://github.com/Lincoln23 ";
            sendUserMessage("Close", userMessage, "Projects", slots, "Language", null);
        }
    }
};     