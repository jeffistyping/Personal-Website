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
                            "contentType": "CustomPayload",
                            "content": message,
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
                        "slots": slots,
                    }
                });
                break;

        }
    }

    if (LanguageType == "reset" || LanguageType == "cancel") {
        sendUserMessage("Delegate", null, null, slots, null, null);
    }

        if (event.sessionAttributes['repeat'] && LanguageType == null) {
            let response = "I have done lots of projects! Discover my projects by typing the language you are interested in. Exit by saying \"cancel\"";
            sendUserMessage("ElicitSlot", response, "Projects", slots, "Language", null);
        } else {
            let string = event.inputTranscript
            let regexJavascript = /javascript|node\.js|node|MySql|Sql|mysql|sql/g;
            let regexFrontEnd = /HTML|html|css|CSS|Css|Bootstrap|bootstrap|frontend|Front-end|front end|Front End|Front-End/g;
            let regexJava = /Java|java|JAVA|back-end|Back-end|backend|back end|mysql|Mysql|MySql|Sql|sql/g;
            let regexAndroid = /Android|android|Android/g
            let regexPhp = /PHP|php|Php/g
            let regexC = /C\+\+|c\+\+/g
            if (string.match(regexJavascript) != null) {
                LanguageType = "node"
                let response = "In Node.js I built a Data-Integration system that allows multiple users to seamlessly authorize with OAuth2.0 and pull data from 10+ services into a single database!"
                event.sessionAttributes['repeat'] = false;
                sendUserMessage("ElicitSlot", response, "Projects", slots, "Language", null);
            } else if (string.match(regexFrontEnd) != null) {
                LanguageType = "html"
                let response = "I have built an interactive website that allows users to find different types of restaurants by clicking around in Google Maps. I have also create this! the website you are on right now!"
                event.sessionAttributes['repeat'] = false;
                sendUserMessage("ElicitSlot", response, "Projects", slots, "Language", null);
            } else if (string.match(regexJava) != null) {
                LanguageType = "Java";
                let response = "I have made a Spring Boot REST API using AWS Comprehend that analyzes user inputs and queries a database to return relevant information. I have also done work in Android! Ask me about it!"
                event.sessionAttributes['repeat'] = false;
                sendUserMessage("ElicitSlot", response, "Projects", slots, "Language", null);
            } else if (string.match(regexAndroid) != null) {
                LanguageType = "Android";
                let response = "The first app I created was a calculator app which can calculate the Nth root of any number and find the GCD/LCM. My second app is inspired from my running challenge, I created an app that informs the user about the weather and notifies the user whether it is a suitable day for running based on their preferences!"
                event.sessionAttributes['repeat'] = false;
                sendUserMessage("ElicitSlot", response, "Projects", slots, "Language", null);
            } else if (string.match(regexPhp)) {
                LanguageType = "php"
                let response = "This website's Contact form is done in PHP! and I have also made a an Php API using the Slim framework for an earlier version of my chatbot that fetches data form a database!"
                event.sessionAttributes['repeat'] = false;
                sendUserMessage("ElicitSlot", response, "Projects", slots, "Language", null);
            } else if (string.match(regexC) != null) {
                LanguageType = "C++"
                let response = "With C++ my team created a pressure activated system that allows an individual to unlock/lock their door by knocking on the pressure pad in a specific patter. I am also created a program that calculates statistics about students grades from a .csv file"
                event.sessionAttributes['repeat'] = false;
                sendUserMessage("ElicitSlot", response, "Projects", slots, "Language", null);
            } else {
                let userMessage = "Sorry, Looks like I didn't understand what you said or I haven't done a project with that language yet! However, Please feel free to checkout my github for all the other projects: https://github.com/Lincoln23 ";
                sendUserMessage("ElicitSlot", userMessage, "Projects", slots, "Language", null);
            }
        }
    

};