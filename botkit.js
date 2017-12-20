// if (!process.env.token) {
//     console.log('Error: Specify token in environment');
//     process.exit(1);
// }

var Botkit = require('botkit');
var wit = require('botkit-witai')({
    accessToken: 'LI5CGZRJNZWQETZ2WS3JMMBAAAZEBVT4',
    logLevel: 'debug'
})
var heading
var steps
var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    // token: process.env.token
    token: 'xoxb-278047956548-WtmeeGSfH8YKfCGuNg0J8sqz'
}).startRTM();

controller.middleware.receive.use(wit.receive)

controller.hears('', 'direct_message', function (bot, message) {
    if (message.entities.Intent[0].value == 'Create'){
      bot.startConversation(message, function(err, convo) {
        if (!err) {
           convo.ask('Please write the heading', function(response, convo) {
             heading = response.text
             convo.next()
             convo.ask('Please write the steps', function(response, convo) {
                steps = response.text
                convo.next()
                convo.ask(`Are you happy with the test case? ${heading} ${steps}`, [
                  {
                    pattern: 'yes',
                    callback: function(response, convo) {
                      convo.next();
                    }
                  },
                  {
                    pattern: 'no',
                    callback: function(response, convo) {
                      convo.stop();
                    }
                  }
                ])
                convo.next()
            })
           })
           convo.on('end', function(convo) {
              if (convo.status == 'completed') {
                bot.reply(message,'Uploading the test case')
              } else {
                bot.reply(message,'Sorry about that, what else can I do for you?')
              }
           })
        }
      })
    } else if (message.entities.Intent[0].value == 'Delete') {
      bot.reply(message, "Delete the test case")
    } else {
      bot.reply(message, "Did not Found the intent")
    }
});
