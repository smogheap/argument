var names = {
	'male':		[ 'Mark', 'Santiago', 'Dave', 'Tim' ],
	'female':	[ 'Linda', 'Lacy', 'Susan' ],
	'neutral':	[ 'Sam', 'Max', 'Andy', 'Alex' ]
};

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
module.exports = function()
{
	var c = {
		age:		randInt(18, 103)
	};

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

	return(c);
};

