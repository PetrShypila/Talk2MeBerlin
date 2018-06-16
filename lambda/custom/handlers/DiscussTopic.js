const querystring = require('querystring');
const https = require("https");
  
const DiscussTopicIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'DiscussTopicIntent';
    },

    handle(handlerInput) {

        let speechText = 'Okay, you have 45 seconds to discuss' +
        '<audio src="https://www.jovo.tech/audio/BCwPA7Pa-02-start-topic-2.mp3" />' +
        '<audio src="https://www.jovo.tech/audio/PmvVjZSt-30-seconds-of-silence.mp3" />' +
        '<audio src="https://www.jovo.tech/audio/TK0z6wat-04-notification.mp3" />' +
        '15 seconds left. Does anyone else has to say something about team shirts?' +
        '<audio src="https://www.jovo.tech/audio/EpgWnG37-15-seconds-of-silence.mp3" />' +
        '<audio src="https://www.jovo.tech/audio/YPhsA6Te-03-success-2.mp3" />' +
        'Okay, times up! Is there anything I can write down about team shirts? Keep it short please!';
        

        return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard('Pacman', speechText)
        .getResponse();
    },
};

module.exports = DiscussTopicIntentHandler;
