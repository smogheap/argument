character = require('./character');


process.stdout.write("Welcome to argument\n");
process.stdin.setEncoding('utf8');

process.stdin.on('readable', function()
{
	var line;

	if ((line = process.stdin.read())) {
		// TODO Act on the response...
		//
		// This should go alone with a menu displaying x (probably 4) responses
		// that the character currently controlled by the player can give.
		//
		// Eventually this should be replaced with an event that the consuming
		// program can register...
		//
		//			argument.on('prompt', function(options) {
		//				argument.say(0);
		//			});

		console.log(new character());
	}
});

var c = new character();
console.log(c);

c.on('ask', function(question) {
	console.log(question);
});

