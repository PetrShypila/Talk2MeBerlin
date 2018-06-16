/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const querystring = require('querystring');
const https = require("https");

const users = {
  "iron man": "54155be2d06e96a67a5d08ac",
};

const createCard = function(params) {

  let qs = querystring.stringify(
    Object.assign(
      {},
      {
        idList: '5b24625224dfd1659098a4a8',
        keepFromSource: 'all',
        key: 'e11aa993a3cf946623266a62b240ad2b',
        token: '38c8cc180c873e6c35fcd6e76cdde1a1dd85cb4d0cad7df0e69bb5d1195cc72b'
      },
      params
    ));

  console.log(`Query String: ${qs}`);

  let options = {
    method: 'POST',
    hostname: 'api.trello.com',
    port: 443,
    path: '/1/cards',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': qs.length
    }
  };

  let req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.write(qs);
  req.end();
};

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Hey there! How is your planning?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Scrum master', speechText)
      .getResponse();
  },
};

const NewTaskIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'NewTaskIntent';
  },
  handle(handlerInput) {
    const apiParams = {};

    console.log(`Inside NewTaskIntent`);

    let speechText = 'Sorry I didn\'t understand what is the ticket name?';
    
    const {request} = handlerInput.requestEnvelope;
    const {Task, User} = request.intent.slots;
    
    if(Task.value) {
      // task presented
      apiParams.name = Task.value;

      console.log(`API PARAMS NAME: ${Task.value}`);

      speechText = 'Okay, the issue has been added to Trello board!';

      if (User.value) {
        speechText = 'Okay, the issue has been added to Trello board and assigned to X!';
        if (User.resolutions.resolutionsPerAuthority[0].status.code !== 'ER_SUCCESS_MATCH') {
          speechText = 'Hmm... I cannot find anyone in our department with that name, so I didn\'t create the issue';
        } else {
          apiParams.idMembers = users[User.value];
          createCard(apiParams);
          console.log(`ASSIGNEE NAME: ${apiParams.idMembers}`);
        }
      } else {
        createCard(apiParams);
      }
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    NewTaskIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
