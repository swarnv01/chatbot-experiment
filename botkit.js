// if (!process.env.token) {
//     console.log('Error: Specify token in environment');
//     process.exit(1);
// }

var Botkit = require('botkit');
var wit = require('botkit-witai')({
    // accessToken: 'LI5CGZRJNZWQETZ2WS3JMMBAAAZEBVT4',
    accessToken: 'MYWH5DWLDSHKBA4YX2YFHL75OGSABFOQ',
    logLevel: 'debug'
})
var heading
var steps
var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    // token: process.env.token
    // token: 'xoxb-278047956548-WtmeeGSfH8YKfCGuNg0J8sqz'
    token: 'xoxb-275091219526-MOO5Z8nrEUctH4D7SbpWLWLX'
    // token: 'xoxp-273155884230-273155884646-276320839283-bc1d26a5a06cb49f346fdd3c0cf501ab'
}).startRTM();

controller.middleware.receive.use(wit.receive)



controller.hears('', 'direct_message', function (bot, message) {

    bot.createConversation(message, function(err, convo) {

        // create a path for when a user says YES
        convo.addMessage({
                text: 'You said yes! How wonderful',
                action: 'deviceCount_thread',
        },'yes_thread');

        // create a path for when a user says NO
        convo.addMessage({
            text: 'You said no, that is too bad.',
        },'no_thread');

        // create a path where neither option was matched
        // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
        convo.addMessage({
            text: 'Sorry I did not understand.',
            action: 'default',
        },'bad_response');

        // Once the values are confirmed it Done message
        convo.addMessage({
            text: 'Done!',
            // action: some_function() call the function to calculate execution time
        },'congratulation');

        convo.addMessage({
            text: 'Ohh! Try Again',
            action: 'deviceCount_thread',
        },'no_response');

        convo.addQuestion(`Kindly confirm your response? DeviceCount: {{vars.deviceCount}} TestCaseCount: {{vars.testCaseCount}}`, [
          {
              pattern: 'yes',
              callback: function(response, convo) {
                  convo.gotoThread('congratulation');
              },
          },
          {
              pattern: 'no',
              callback: function(response, convo) {
                  convo.gotoThread('no_response');
              },
          },
          {
              default: true,
              callback: function(response, convo) {
                  convo.gotoThread('bad_response');
              },
          }
        ], {}, 'confirmation_thread')

        // Create a yes/no question in the default thread...
        convo.addQuestion('Do you want me to calculate how much time it will take to complete regression?', [
            {
                pattern: 'yes',
                callback: function(response, convo) {
                    convo.gotoThread('yes_thread');
                },
            },
            {
                pattern: 'no',
                callback: function(response, convo) {
                    convo.gotoThread('no_thread');
                },
            },
            {
                pattern: 'shutdown',
                callback: function(response, convo) {
                    convo.gotoThread('shutdown');
                },
            },
            {
                default: true,
                callback: function(response, convo) {
                    convo.gotoThread('bad_response');
                },
            }
        ],{},'default');

        convo.addQuestion({text: "Kindly tell me total number of devices?",
         quick_replies: [{content_type: "deviceCount"}]
       }, (res, convo)=>{
         convo.setVar('deviceCount', res.text);
         convo.gotoThread('testCaseCount_thread');
       },{key: "deviceCount"}, 'deviceCount_thread');

       convo.addQuestion({text: "Kindly tell me total number of testcase Count?",
        quick_replies: [{content_type: "testcaseCount"}]
      }, (res, convo)=>{
        convo.setVar('testCaseCount', res.text);
        convo.gotoThread('confirmation_thread');
      },{key: "testCaseCount"}, 'testCaseCount_thread');

        convo.activate();
    });

});



controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});
