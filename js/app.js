//variables 
const overlay = document.getElementById('overlay');
const keyboard = document.getElementById('qwerty');
const phrase = document.querySelector('#phrase ul');
const scoreboard = document.querySelector('#scoreboard ol');
let missed = 0;

// phrases
let phrases = [
	'a blessing in disguise',
	'a dime a dozen',
	'beat around the bush',
	'better late than never',
	'so far so good'
];

// random phrase selector parse into character array
function getRandomPhraseAsArray(phraseArray) {
	// random index value 0 - whatever length of array
	let randomPhrase = phraseArray[Math.floor(Math.random() * (5))];
	let finalPhrase = randomPhrase.split("");
	return finalPhrase;
};

// add characters to board
function addPhraseToDisplay(charArray) {
	for(let i = 0; i < charArray.length; i++) {
		if(charArray[i] != " ") {
			let newLi = document.createElement('li');
			newLi.innerHTML = charArray[i];
			newLi.className = 'letter';
			phrase.appendChild(newLi);
		} else {
			let newSpace = document.createElement('li');
			newSpace.innerHTML = " ";
			newSpace.className = 'space';
			phrase.appendChild(newSpace);
		};
	};
};

// clear board
function clearBoard() {
	while(phrase.firstChild) {
		phrase.removeChild(phrase.firstChild);
	};
};

// enable all buttons 
function enableButtons() {
	$("button").each(function() {
  	// first copy the attributes to remove
  	// if we don't do this it causes problems
  	// iterating over the array we're removing
  	// elements from
 	var attributes = $.map(this.attributes, function(item) {
    	return item.name;
  	});

  	this.className = ' ';

  	// now use jQuery to remove the attributes
  	var img = $(this);
  	$.each(attributes, function(i, item) {
    	img.removeAttr(item);
  	});
	});
};

// grant lives 
function resetHearts() {
	while(scoreboard.children.length != 0) {
		scoreboard.removeChild(scoreboard.lastElementChild);
	};
	for(let i = 0; i < 5; i++) {
		let life = document.createElement('li');
		let heartImg = document.createElement('img');
		heartImg.src = 'images/liveHeart.png';
		heartImg.className = 'tries';
		heartImg.style.height = '35px';
		heartImg.style.width = '30px';
		life.appendChild(heartImg);
		scoreboard.appendChild(life);
	};
}

// set overlay
function setOverlay(endResult) {
	clearBoard();
	addPhraseToDisplay(getRandomPhraseAsArray(phrases));
	enableButtons();
	resetHearts();
	missed = 0;
	if(endResult === 'win') {
		overlay.className = 'win';
		overlay.style.display = 'block';
		overlay.querySelector('h2').innerHTML = 'Congratulations, You\'ve won';
		overlay.querySelector('a').innerHTML = 'Play Again? ';
	} else if (endResult === 'lose') {
		overlay.className = 'lose';
		overlay.style.display = 'block';
		overlay.querySelector('h2').innerHTML = 'Sorry, better luck next time.';
		overlay.querySelector('a').innerHTML = 'Play Again? ';
	};
};

// check letter function
function checkLetter(button) {
	let context = document.getElementsByClassName('letter');
	let temp = ' ';
	button.setAttribute('disabled','true');
	for (let i = 0; i < context.length; i++) {
		if (button.innerHTML === context[i].innerHTML) {
			context[i].className += ' show';
			temp = context[i].innerHTML;
		}
	}
	if(temp === ' ') {
		return null;
	} else {
		return temp;
	}
};

// check win
function checkWin() {
	let showLetters = document.getElementsByClassName('show');
	let letters = document.getElementsByClassName('letter');
	if(showLetters.length === letters.length) {
		setOverlay('win');
	} else if (missed >= 5) {
		setOverlay('lose');
	};
};

// =============== Main Program ==================================>>>

// add random phrase to board
addPhraseToDisplay(getRandomPhraseAsArray(phrases));


// add event listener to overlay and hide overlay to display game
overlay.addEventListener('click', (e)=> {
	// start button will hide overlay 
	if (e.target.className === 'btn__reset') {
		overlay.style.display = 'none';
	}
});

// event listener on buttons
keyboard.addEventListener('click', (e) => {
	if(e.target.tagName === 'BUTTON') {
		e.target.className += ' disabled';
		let letterFound = checkLetter(e.target);
		if(letterFound === null) {
			scoreboard.removeChild(scoreboard.lastElementChild);
			missed += 1;
		};
		checkWin();
	};
});