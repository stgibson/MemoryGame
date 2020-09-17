const gameContainer = document.getElementById("game");

const IMAGES = [
  "a-space-odyssey",
  "a-clockwork-orange",
  "barry-lyndon",
  "dr-strangelove",
  "the-shining",
  "a-space-odyssey",
  "a-clockwork-orange",
  "barry-lyndon",
  "dr-strangelove",
  "the-shining"
];

const numberOfPairs = IMAGES.length / 2;

const title = document.querySelector("h1");

// get the best score from storage, if it is there
let bestScore = parseInt(localStorage.getItem("bestScore"));
const bestScoreText = document.querySelector("#bestScore");
// if there is a best score, display it on the screen
if (bestScore) {
  bestScoreText.innerText = `${bestScoreText.innerText} ${bestScore}`;
}
// else, display a underline to denote no best score
else {
  bestScoreText.innerText = `${bestScoreText.innerText} ___`;
}
// to keep track of player's score when playing the game
let userScore = 0;
// so program knows when player completes the game
let pairsFound = 0;

// create text for displaying user's score (will display when game starts)
const userScoreText = document.createElement("h2");
userScoreText.innerText = `Your score: ${userScore}`;

const startButton = document.querySelector("#startButton");

// create restart button to show when player finishes game
const restartButton = document.createElement("button");
restartButton.innerText = "Play Again?";

// get infoDiv to add user's score and restart button
const infoDiv = document.querySelector("#info");

/**
 * Here is a helper function to shuffle an array. It returns the same array
 * with values shuffled it is based on an algorithm called Fisher Yates if you
 * want to research more.
 * @param array: [String]
 * @return array after being shuffled
 */
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledImages = shuffle(IMAGES);

/**
 * This function loops over the array of images. It creates a new div and gives
 * it a class with the value of the images. It also adds an event listener for
 * a click for each card.
 * @param imageArray: [String]
 */
function createDivsForImages(imageArray) {
  // keep track of which number is being placed
  let counter = 1;
  const leftPosInit = 40;
  let leftPos = leftPosInit;

  for (let image of imageArray) {
    // if this is the sixth div, start second row
    if (counter === 1 || counter === 6) {
      leftPos = leftPosInit;
    }
    // else, move div to the left
    else {
      leftPos += 180;
    }

    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(image);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // set fixed width, height, and position
    newDiv.style.width = "150px";
    newDiv.style.height = "150px";
    newDiv.style.position = "fixed";
    newDiv.style.padding = "0";
    newDiv.style.left = `${leftPos}px`;
    if (counter >= 6) {
      newDiv.style.transform = "translateY(180px)";
    }

    // append the div to the element with an id of game
    gameContainer.append(newDiv);

    counter++;
  }
}

// for storing the first and second divs picked in a pair
let firstImagePicked = null;
let secondImagePicked = null;

/**
 * This function handles the different possible cases for when the user clicks
 * on a card, whether it was the first in a pair or the second, or an invalid
 * card (one that is already facing up), in which nothing happens.
 * @param event {any}
 */
function handleCardClick(event) {
  // if there is a background image, the image will be clicked on, not the div
  if (!event.target.style.backgroundImage) {
    // if this is the 1st of a pair clicked, set image
    if (!firstImagePicked) {
      // update score to reflect that the user just made a valid move
      userScore++;
      userScoreText.innerText = `Your score: ${userScore}`;
      firstImagePicked = event.target;
      const imageURL = `url("images/${firstImagePicked.className}.jpg")`;
      firstImagePicked.style.backgroundImage = imageURL;
      firstImagePicked.style.backgroundSize = "150px 150px";
    }
    // if this is the 2nd of a pair clicked, set image and compare with 1st
    else if (!secondImagePicked) {
      // update score to reflect that the user just made a valid move
      userScore++;
      userScoreText.innerText = `Your score: ${userScore}`;
      secondImagePicked = event.target;
      const imageURL = `url("images/${secondImagePicked.className}.jpg")`;
      secondImagePicked.style.backgroundImage = imageURL;
      secondImagePicked.style.backgroundSize = "150px 150px";
      
      // if images are same, keep the images on and reset vars. for new pair
      if (firstImagePicked.className === secondImagePicked.className) {
        pairsFound++;
        firstImagePicked = null;
        secondImagePicked = null;

        // check if game is over
        if (pairsFound === numberOfPairs) {
          // give player some time to see final state of the board
          setTimeout(function() {
            endGame();
          }, 1000);
        }
      }
      // if images are different, clear images and reset vars. after a second
      else {
        setTimeout(function() {
          firstImagePicked.style.backgroundImage = null;
          secondImagePicked.style.backgroundImage = null;
          firstImagePicked = null;
          secondImagePicked = null;
        }, 1000);
      }
    }
  }
}

// start the game when the user clicks the start button
startButton.addEventListener("click", function(event) {
  startButton.remove();
  infoDiv.prepend(userScoreText);
  createDivsForImages(shuffledImages);
});

// restart the game when the user clicks the restart button
restartButton.addEventListener("click", function(event) {
  title.innerText = "The Stanley Kubrick Memory Game!";
  restartButton.remove();
  pairsFound = 0;
  userScore = 0;
  userScoreText.innerText = `Your score: ${userScore}`;
  shuffledImages = shuffle(IMAGES);
  createDivsForImages(shuffledImages);
});

/**
 * Ends the game, displays user's final score along with the "You Won" screen,
 * and updates the best score in localStorage if necessary.
 */
function endGame() {
  title.innerText = "You Won!";
  // remove divs in game div
  for (let image of IMAGES) {
    const imageDiv = document.querySelector(`.${image}`);
    imageDiv.remove();
  }
  // add restart button
  infoDiv.append(restartButton);
  // if user got a better score than the best score, update best score
  if (!bestScore || userScore < bestScore) {
    bestScore = userScore;
    bestScoreText.innerText = `Best score: ${bestScore}`;
    localStorage.setItem("bestScore", bestScore.toString());
  }
}