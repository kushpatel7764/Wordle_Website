import React, { useState } from 'react';
import { useEffect } from 'react';

function Square() {
  return (
    <button className="square" ></button>
  );
}

function Key({value}){
  return (
    <button className="key" id={value} >{value}</button>
  )
}

function getAllWords(){
  const [fileContent, setFileContent] = useState("");
  useEffect(()=>{
    const fetchFile = async ()=>{
      try {
        const response = await fetch("/words");
        if (!response.ok) {
          throw new Error("Failed to fetch file");
        }
        setFileContent(await response.text());
      }catch (error){
        console.error("Error reading file:", error);
      }
    };
    fetchFile();
  }, []);
  //Convert String of words to array of words using split("\\n")
  return fileContent.split('\n');

}


function KeyRow(){
  return (
    <>
      <div className="keyrow1">
          <Key value="Q"/>
          <Key value="W"/>
          <Key value="E"/>
          <Key value="R"/>
          <Key value="T"/>
          <Key value="Y"/>
          <Key value="U"/>
          <Key value="I"/>
          <Key value="O"/>
          <Key value="P"/>
      </div>
      <div className="keyrow2"> 
          <Key value="A"/>
          <Key value="S"/>
          <Key value="D"/>
          <Key value="F"/>
          <Key value="G"/>
          <Key value="H"/>
          <Key value="J"/>
          <Key value="K"/>
          <Key value="L"/>
      </div>
      <div className="keyrow3"> 
          <Key value="ENTER"/>
          <Key value="Z"/>
          <Key value="X"/>
          <Key value="C"/>
          <Key value="V"/>
          <Key value="B"/>
          <Key value="N"/>
          <Key value="M"/>
          <Key value="EXIT"/>
      </div>
        
    </>
  )
}

function KeyBoard(){
  return (
    <>
      <div className="keyboard">
        <KeyRow />
      </div>
    </>
  )
}

function BoardRow(){
  return (
    <div className="board-row">
       <Square />
       <Square />
       <Square />
       <Square />
       <Square />
    </div>
  )
}

function Board(){
  return (
    <>
      <div className="board">
        <BoardRow />
        <BoardRow />
        <BoardRow />
        <BoardRow />
        <BoardRow />
        <BoardRow />
      </div>
    </>
  )
}

function fiveLettersIn(length){
  if (length %5 == 0 ){
    //length must be greater than 0 
    if (length === 0){
      return false
    }
    return true 
  } else{
    
    return false
  }
}

function isBackspacePreviousRow(noBackspaceAtLength, previousLetterBeforeCurrentIndex){
  //No Backspacing at or after noBackspaceAtLength.
  if (noBackspaceAtLength != 0){
    if (noBackspaceAtLength > (previousLetterBeforeCurrentIndex)){
      return true;
    } else{
      return false; 
    }
  } else{
    false;
  }
}

function writeToSquare(at, letter){
    //if key is not BackSpace set the current square to the last key in array.  
    document.getElementsByClassName("square")[at].innerHTML = letter; 
    //Give a darker gray to the square
    document.getElementsByClassName("square")[at].style.borderColor = "gray";
}

function eraseFromSquare(at){
  //if key is not BackSpace set the current square to the last key in array.  
  document.getElementsByClassName("square")[at].innerHTML = ""; 
  //Give a darker gray to the square
  document.getElementsByClassName("square")[at].style.borderColor = "lightgray";
}

function handleBackspace(myArray,  previousLetterBeforeCurrentIndex){
  //Handle-----"Backspace"
  //Check if there is a letter in array before trying to remove the letter.
  if (myArray[previousLetterBeforeCurrentIndex] ){
    //Then Backspace should remove the letter before backspce
    myArray.pop();
    eraseFromSquare(previousLetterBeforeCurrentIndex);
    return myArray;
  }  
}

function chooseRandWordFromDict (wordArray){
  // Split the word string into an array of words
  //const wordArray = wordString.split("\n").map(word => word.split("\\n")); //.trim removes whitespace from both side of string
  //const wordArray = wordString.split('\\n');
  // Pick a random index from the word array
  const randomIndex = Math.floor(Math.random() * wordArray.length); //Math.random() return any number between 0 and 1 and Math.Floor just return the greater integer in the number.

  // Retrieve the word at the random index
  const randomWord = wordArray[randomIndex];

  return randomWord;
}

// Check if user's word exists in the file
function legitGuess(guess, wordsArray){
    var printMessage =  document.getElementsByClassName("message")[0]; 
    //If the words array contain guess in all lowers case since include is case sensetive.
    if (wordsArray.includes(guess.toLowerCase())){
      //if user's guess word is in the wordsArray then return true
      return true;
      //if user's guess word is not in the word list then return false
    }else{
      //println("$guessNum. Your word does not exist in the file. Enter a legitimate word")
      printMessage.innerHTML = (guess + " does not exist in the file. Enter a legitimate word");
      return false;
      
    }
}

function countCharacterOccurrences(guess){
  var repitionMap = {}
  
  //Iterate through each character in string
  for (let i = 0; i < guess.length; i++){
    var letter = guess[i];
    // create a variable that can be used to determine how many times each character appears in the word
    var numCharPresent = 0
    // Iterate through the string again to count occurrences of the current character
    for (let k = 0; k < guess.length; k++){
      if (letter == guess[k]){
        numCharPresent++;
      }
    }
    // Store the character and its occurrence count in the object
    repitionMap[letter] = numCharPresent;
  }
  return repitionMap;
}

function changeBackgroundColor(index, color) {
  const dictonary = new Map();
  dictonary.set("green", 3);
  dictonary.set("yellow",2);
  dictonary.set("gray",1); 
  const letterElements = document.getElementsByClassName("square")[index]; // Assuming letters have a common class
  const keyboardKey = document.getElementById(letterElements.innerHTML.toUpperCase());
  var currentColorPriority = dictonary.get(keyboardKey.style.backgroundColor);
  var newPriority = dictonary.get(color)
  if (currentColorPriority < newPriority) {

    //set keyboard color
    keyboardKey.style.backgroundColor = color;
  } else if (currentColorPriority == undefined){
    keyboardKey.style.backgroundColor = color;
  }
  //Make an array that track letter with color.
  //Set sqaure color
  letterElements.style.backgroundColor = color;
}

function gameState(guess, word, row){
  // getting a mutable map that holds the repetition amount of each letter in the word
  const wletterOccurrences = countCharacterOccurrences(word);
  const gletterOccurrences = countCharacterOccurrences(guess);
  //multiOccurrence variable check for a specific issue
  var multiOccurrence = false

  const letter_in_word = (letter, word) => {
      for (let i = 0; i < word.length; i++){
        if (letter == word[i]){
          return true;
        }
      } 
      return false; 
  }
  // looping through each letter in the guess word to determine it's background color
  for (let g = 0; g < guess.length; g++){
    /*
    This if statement is supposed to resolve a specific case:
    For example, if the word was mungo and the user's guess was vuggy, there would be a issue with the letter g
    Without this if statement the first g would be yellow and then the second g would be black, this is wrong. The way
    it should be is that the first g should be black and the second g should be green. This if statement solves this issue.
    New Issue
    chosen: genes
    UserInput: Needs (Og Code: first is green, second e is black)
    Correct Answer: first is green, second is yellow
     */
    //Since the error can only occur if the user's guess had more of the same letter than the word itself, we check for that first
    //if guess[g] is not in list then return 0;
    if (wletterOccurrences[guess[g]] ){
      var currentWordLetterCount = wletterOccurrences[guess[g]];
    } else{
      var currentWordLetterCount = 0; 
    }

    if (gletterOccurrences[guess[g]]){
      var currentGuessLetterCount = gletterOccurrences[guess[g]];
    } else{
      var currentGuessLetterCount = 0;
    }
    if (currentWordLetterCount < currentGuessLetterCount) {
      //console.log("Guess count: " + currentGuessLetterCount + " for letter " + guess[g])
      //console.log("Word count: " + currentWordLetterCount + " for letter " + guess[g])
        //First iterate through every letter in guess
        for (let j = 0; j < guess.length; j++){
            //if there is two letter match at an index and at the matching index is the current letter then this letter should be black
            if (guess[j] == word[j] && guess[j] == guess[g]){
                //by making multiOccurrence true background of this letter will not become yellow
                multiOccurrence = true
                break
            } else{
                multiOccurrence = false
            }
        }
        if (multiOccurrence == true){
          for (let j = 0; j < guess.length; j++){
            //From current index on, if this letter is in list turn off multiOccurrence
            //guess[g] - current letter;
            //word[j] - letter at word in forloop;  
            //(j >= g && guess[g] == words[j]) -- if at or after current index, the current letter is in word then no set multiOccurrence so yellow can be set. 
            console.log("Guess letter:" + guess[g] + ", index:" + g)
            console.log("Word letter:" + word[j] + ", index:" + j)
            if (j <= g && guess[g] == word[j]){
              multiOccurrence = false
              break
            }else{
              multiOccurrence = true
            }
          }
        }
    } else{
        multiOccurrence = false
    }
    // If the guess letter is at the same index as the word letter (they also have to be the same letters) and if it has appearance left in the word
    // then its color should be green
    if (guess[g] == "e"){
      console.log("letter: "+guess[g] + " Output for letter_in_word(): " + ((letter_in_word(guess[g], word))))
      console.log("letter: "+guess[g] + " Output for wletterOccurences: " + ((wletterOccurrences[guess[g]] >= 1) ))
      console.log("letter: "+guess[g] + " Output for multioccurance: " + ((multiOccurrence)))

      
    }
    if ((guess[g] == word[g]) && (wletterOccurrences[guess[g]] >= 1)) {
      //make the letter background color green
      //TODO: Make background green with Brenan's function
      var index = row + g;
      changeBackgroundColor(index, "green")
      //decrement the appearance of this letter in the word now
      wletterOccurrences[guess[g]] = wletterOccurrences[guess[g]] - 1
    }
    //If the guess letter is in the word (it will not be in the same index) and if it has appearance left in the word
    // then its color should be yellow
    //TODO: doublecheck in
    else if ((letter_in_word(guess[g], word)) && (wletterOccurrences[guess[g]] >= 1) && (!multiOccurrence)) {
        //make the letter background color yellow
        //TODO: Make background yellow with Brenan's function
        var index = row + g;
        changeBackgroundColor(index, "yellow")
        //decrement the appearance of this letter in the word now
      wletterOccurrences[guess[g]] = wletterOccurrences[guess[g]] - 1
    }else{
      //color the letter background black
      //TODO: Make background black with Brenan's function
      var index = row + g;
      changeBackgroundColor(index, "gray")
    }

  }
}

// Determine when the game is over and print out the game state.
// If the game is over, congratulate the user
function gameOver(userInput, word, row){
  var printMessage = document.getElementsByClassName("message")[0]; 
  //Return true if user guessed the word, else return the gameState
  if (userInput == word){
      //if user guessed correctly then show the gamestate and congratulations
      gameState(userInput, word, row)
      console.log("Congratulations")
      return true
  }
  else{
      //just show gameState
      gameState(userInput, word, row)
      console.log("try again")
      return false
  }

}


//Get user's guess
function getInput(noBackspaceAtLength){
  var start = noBackspaceAtLength
  var end = noBackspaceAtLength + 5
  var userGuess = ""
  for (let i = start; i < end; i++){
    var square = document.getElementsByClassName("square")[i]
    userGuess = userGuess + square.innerHTML
  }
  return userGuess;
}


//chosenWord refreses like four times.
function GameSetup(){
  const wordsArray = getAllWords();
  const chosenWord = chooseRandWordFromDict(wordsArray);
  //const chosenWord = "genes";
  //Get all the words from words dictonary.
  const [words, setWords] = useState([]);
  const [word, setWord] = useState([]);

  const setWordsArray = () => { //3 hours of work to figure this out. 
    for (let i = 0; i < wordsArray.length; i++){
      words.push(wordsArray[i])
    }
  }
  setWordsArray();

  const setChosenWord = () => {
    //Clear previous word store
    if (word.length != 0){
      const ogListSize = word.length
      for (let k = 0; k < ogListSize; k++){
        word.pop();
      }
    }
    //set new word
    for (let i = 0; i < chosenWord.length; i++){
      word.push(chosenWord[i]);
    }
  }
  setChosenWord();
  console.log("ChosenWord = "+chosenWord+", word = "+word);
  const [myArray, setMyArray] = useState([]);
  var arrayfull = false;
  var enterPressed = false;
  var noBackspaceAtLength = 0; 
  var onlyLetters = /^[a-zA-Z]$/; 
  var guessNumber = 0;  //If guessNumber is like 7 then end with win or lose
  var guessCorrect = false;
  //TODO: only let the user in aplhabets
  //User Input
  useEffect(()=>{
    document.addEventListener("keydown", keyInputDetected, true);
  }, [])
  
  //Only called when a key is pressed
  const keyInputDetected = (e)=>{ 
    var chosenWord = word.join("");
    if (guessCorrect == true){
      return;
    }
    if (guessNumber >= 5){
      var printMessage = document.getElementsByClassName("message")[0]; 
      printMessage.innerHTML = "The correct word is " + chosenWord;
    }
    //Length of myArray after a key from 'keydown' is added
    if (!arrayfull){
        if(onlyLetters.test(e.key) || e.key == "Backspace" || e.key == "Enter"){
          var length = myArray.push(e.key);
        }else{
          return;
        }
        var printMessage = document.getElementsByClassName("message")[0]; 
        //Same things "previousLength" and "currentLetterIndex" but just different purposes.
        var previousLength = length - 1;
        var currentLetterIndex = length - 1;
        var previousLetterBeforeCurrentIndex = length - 2;
        var maxArraySize = 30;


        let rowComplete = fiveLettersIn(previousLength);
        let onFirstRow = (noBackspaceAtLength == 0); 
        let onCurrentSquareEnterNotPressedPreviously = (noBackspaceAtLength != previousLength);

        //length -1 = last index
        if ((rowComplete && (enterPressed == false)) && (onFirstRow ||  onCurrentSquareEnterNotPressedPreviously)){
          //if the last key placed in array is not "Enter" then remove the last thing placed from array and return.
          //if the last key placed is "Enter" then do the checks and proceed.
          if (myArray[currentLetterIndex] == "Enter"){
            //Get userGuess
            var userGuess = getInput(noBackspaceAtLength);
            console.log(userGuess);
            //DO checks like if the word is legit and assign color to squares and keyboard here.
            //Make sure legit word sets noBackspaceAfterLength as well. 
            // if the guess word is in wordle.txt then continue else repeat the guess
            if (legitGuess(userGuess.toLowerCase(), words)) {
              //each time user guesses with a legit guess increase his guess amount
              guessNumber += 1
              //if the user guessed correctly then exit
              console.log("chosenWord = " + chosenWord)
              if(gameOver(userGuess.toLowerCase(), chosenWord, noBackspaceAtLength)){
                guessCorrect = true;
                return;
              } 
              //Remove the "Enter" from array and save the row
              myArray.pop();
              enterPressed = true;
              noBackspaceAtLength=(previousLength);
              return;
            }
            //Remove the "Enter"
            myArray.pop();
            return;
           
          } else{
            if (myArray[currentLetterIndex] != "Backspace"){
              //if enter and backspace is not pressed, remove whatever it is that is pressed
              myArray.pop();
              return;
            }
            
          }
        }
    }
    
    //Now update Square as the array says as long is length is not 30 or more 
    if (length <= maxArraySize){
      /*
      If "Enter" is pressed here then it means that the current row 
      is not full and does not have all five squares filled. 
      print message saying "incomplete word". 
      */
      if(myArray[currentLetterIndex] == "Enter"){
        //remove enter from list
        myArray.pop();
        printMessage.innerHTML = "Incomplete word"; 
        return;
      }else{
        printMessage.innerHTML = "";
      }

      //If last index of array is 'Backspace'
      if (myArray[currentLetterIndex] == "Backspace"){
        //Remove the backspace from array
        myArray.pop();
        //No Backspacing at or after noBackspaceAtLength.
        if (isBackspacePreviousRow(noBackspaceAtLength, previousLetterBeforeCurrentIndex)){
          return;
        }
        //Since allowed to backspace, now do backspace.
        setMyArray(handleBackspace(myArray, previousLetterBeforeCurrentIndex));
        return; 
      } 
      //Reseting pressedEnter
      enterPressed = false; 
      var letter = myArray[currentLetterIndex].toUpperCase()
      writeToSquare(currentLetterIndex, letter); 
  
    } else{ 
      //Backspace pressed -- last row, last square things
      if (myArray[currentLetterIndex] == "Backspace"){
        //Remove the backspace from array
        myArray.pop();
        //No Backspacing at or after noBackspaceAtLength.
        if (isBackspacePreviousRow(noBackspaceAtLength, previousLetterBeforeCurrentIndex)){
          return;
        }
        //Since allowed to backspace, now do backspace.
        setMyArray(handleBackspace(myArray, previousLetterBeforeCurrentIndex));
      } else if (myArray[currentLetterIndex] == "Enter"){//Enter pressed
        //Remove the enter from array
        myArray.pop();
        return;
      } else{
        
        arrayfull = true;
      }
    }
  }
  
  return (
    <>
      <section>
        <p className="message"></p>
        <Board />
        <KeyBoard />
      </section>
    </>
  )

}

export default GameSetup;

