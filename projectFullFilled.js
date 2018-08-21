exports.handler = (event, context, callback) => {


    //Get the slot values and set them to variables
    let userInput = event.inputTranscript;
    let LanguageType = event.currentIntent.slots.Language;
    let Another = event.currentIntent.slots.Another;

    //Create array for setting slots in Lex
    let slots = {
        "Language": LanguageType,
        "Another": Another,
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
        var messageToSend = "Okay, conversation has been reset. Is there anything I can help you with?";
        sendUserMessage("ElicitIntent", messageToSend, null, null, null, null);
    }


        let response = "Would you like to learn about my other projects? If just tell me which langauge! or say no to exit"
        sendUserMessage("ElicitSlot", response, "Projects", slots, "Language", null);
    

};

