var EventEmitter	= require('events').EventEmitter;
var util			= require('util');

var names = {
	'male':		[ 'Mark', 'Santiago', 'Dave', 'Tim' ],
	'female':	[ 'Linda', 'Lacy', 'Susan' ],
	'neutral':	[ 'Sam', 'Max', 'Andy', 'Alex' ]
};

/* Keep track of all characters */
var characters = [];

function randInt(min, max)
{
	var range	= max - min;
	var r		= Math.floor((Math.random() * range) % range);

	return(r + min);
}

function randItem(array)
{
	var r = Math.floor(Math.random() * array.length) % array.length;

	return(array[r]);
}

// TODO Add methods to give characters goals. For example a landlord may have a
//		goal to get rent from another character.

// TODO	Add methods to give characters information. For example a landloard may
//		know if there are any apartments for rent, etc.

// TODO Emit events when a character wants to ask a question. Any characters in
//		the same area (all characters for now) can answer the question if they
//		have a valid answer.
//
//		If a question is answered (a response may not provide an answer) then
//		any characters in the area will then know that answer.
//
//		A response can be:
//			answer:		Provide actual information
//			refuse:		Refuse to provide information. This can be a mean
//						response such as "Fuck off, I'm not telling you" or an
//						innocent response such as "Sorry, I don't know".
//
//		Each character should generate a list of 4 possible responses to any
//		question they hear. The responses can be answers or refusals. The
//		answers should be displayed, and then after a short delay one should be
//		picked based on the relationship of the 2 characters.
//
//		The timing should be influenced by the various traits and the
//		relationship as well. For example a shy character may will take longer
//		to respond, or if one character is scared of another they may take
//		take longer as well.
//
//		A bar should be displayed to let the player know when another character
//		is going to respond so the player can respond first. If the player picks
//		an answer while another character is talking then they will be
//		interupted and this may offend or annoy a character.

/*
	Create a character, and assign random attributes. These can be overwritten
	by the consumer as needed.
*/
function Character()
{
	var c = this;

	EventEmitter.call(this);

	characters.push(c);

	c.age		= randInt(18, 103);

	/* Gender */
	c.masculine	= Math.random() * 0.5;
	c.feminine	= Math.random() * 0.5;
	var g = Math.random();

	if (g < 0.45) {
		c.male		= true;
		c.masculine	+= 0.5;
		c.feminine	-= 0.2;
	} else if (g < 0.9) {
		c.female	= true;
		c.feminine	+= 0.5;
		c.masculine	-= 0.2;
	}

	if (c.female) {
		c.name = randItem(names.female);
	} else if (c.male) {
		c.name = randItem(names.male);
	} else {
		c.name = randItem(names.neutral);
	}

	/*
		How grumpy is this character? Assume that the older a character is the
		more likely they are to be grumpy.
	*/
	c.grumpy = Math.random();
	c.grumpy += ((c.age / 100) - 0.5);

	/* How sexy is this character? */
	if (c.age >= 18 && c.age < 50) {
		c.sexy	= Math.random();
	} else {
		c.sexy	= 0;
	}

	c.smart		= Math.random();
	c.patient	= Math.random();
	c.forgiving	= Math.random();
	c.shy		= Math.random();

	// TODO Add as many other attributes as we can think of. The more attributes
	//		we give each character the more realistic they will feel.

	/*
		Wait a variable amount of time based on how shy the character is, and
		then try to start a conversation with anyone else nearby.
	*/
	c.resetBoredom();
	return(c);
};
util.inherits(Character, EventEmitter);
module.exports = Character;

/*
	Return text to display for the specified question ID as it would be said by
	this character.
*/
Character.prototype.getText = function getText(id)
{
	var c		= this;

	switch (id) {
		case 'sup':
			// TODO This needs to be more random
			if (c.shy >= 0.90) return("S..So... uh... Wh..What's... up?");
			if (c.shy >= 0.75) return("So uh... umm.. What's up?");
			if (c.shy >= 0.25) return("What's going on?");
			return("What's up?");

		case 'not much':
			return("Not much");
	}

	return('...');
};

/* Say something to any nearby characters to try to get a conversation going */
Character.prototype.bored = function bored()
{
	// TODO Add some randomness and personality here
	this.say('sup');
};

Character.prototype.resetBoredom = function resetBoredom()
{
	var c			= this;

	/* Wait at least 2 seconds before blurting something out due to boredom */
	var boredTime	= 2;

	/* Add between 0 and 20 seconds based on how shy you are */
	boredTime		+= Math.floor(20 * c.shy);

	/* We don't want to be too predictable */
	boredTime		+= (Math.floor(10 * Math.random()) - 5);

	if (c.boredTimeout) {
		clearTimeout(c.boredTimeout);
	}

	// console.log(c.name, 'will be bored in', boredTime, 'seconds');
	c.boredTimeout = setTimeout(c.bored.bind(c), 1000 * boredTime);
};

/*
	Say something

	If the 'to' argument isn't provided then it will just be said to everyone
	within earshot.
*/
Character.prototype.say = function say(what, to)
{
	var c = this;

	c.resetBoredom();
	if (!what) {
		return;
	}

	var topic = {};

	topic.id		= what;
	topic.text		= c.getText(what);

	if (to) {
		console.log(c.name + '->' + to.name + ': ' + topic.text);
	} else {
		console.log(c.name + ': ' + topic.text);
	}

	for (var i = 0, who; who = characters[i]; i++) {
		if (who == c) {
			continue;
		}

		// TODO Ignore characters that aren't within earshot
		who.hear(topic, c, !to || who == to);
	}
};

/* Hear something that another character said */
Character.prototype.hear = function hear(what, who, overheard)
{
	var c = this;

	c.resetBoredom();

	// TODO Update the relationship between this character and the one that is
	//		talking to us based on what was said. Then come up with 3 or 4
	//		possible responses.
	//
	//		If this character isn't being controlled by the player then delay
	//		for a short period and say one of the responses back.
};

