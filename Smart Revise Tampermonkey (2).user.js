// ==UserScript==
// @name         Smart Revise Tampermonkey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autocompletes smart revise
// @author       You
// @match        https://smartrevise.online/student/revise/*
// @grant        none
// ==/UserScript==

const questionTextID = "questiontext";
const answerButtonID = "js_answerButton";

const correctClass = "btn-success"
const incorrectClass = "btn-danger"

const dataName = "SR_Answers"

var answerTable

var old_question = ""

function handle() {
    const questiontext = document.getElementById(questionTextID);
    var question = questiontext.innerText
    if (question==old_question) {
        setTimeout( handle, 500 );
    } else {
        old_question = question

        var answerButtons = document.getElementsByClassName(answerButtonID);
        for (var i = 0; i < answerButtons.length; i++) {
            handleButton(answerButtons.item(i));
        }
    }
}
function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}
function onClick(button) {
    if (hasClass(button, correctClass) || hasClass(button, incorrectClass) ) {
        if (hasClass(button, correctClass)) {
            button.style.backgroundColor = "#1dc9b7"

            var newValue
                if (answerTable[old_question]) {
                    if (typeof(answerTable[old_question]) == "object") {
                        answerTable[old_question][answerTable[old_question].length] = button.innerText
                    } else {
                        answerTable[old_question] = [answerTable[old_question], button.innerText]
                    }
                } else {
                    answerTable[old_question] = button.innerText
                }

            localStorage.setItem(dataName, JSON.stringify(answerTable))
            localStorage.setItem("AnswersSaved", Object.keys(answerTable).length)
        } else {
            button.style.backgroundColor = "#fd397a"

            setTimeout( () => {
                var correctButton = document.getElementsByClassName(correctClass)[0];

                correctButton.style.backgroundColor = "#1dc9b7"

                var newValue
                if (answerTable[old_question]) {
                    if (typeof(answerTable[old_question]) == "object" && !answerTable[old_question].includes(button.innerText)) {
                        answerTable[old_question][answerTable[old_question].length] = correctButton.innerText
                    } else {
                        answerTable[old_question] = [answerTable[old_question], correctButton.innerText]
                    }
                } else {
                    answerTable[old_question] = correctButton.innerText
                }

                localStorage.setItem(dataName, JSON.stringify(answerTable))
                localStorage.setItem("AnswersSaved", Object.keys(answerTable).length)
            }, 0)
        }

        handle()
    } else {
        setTimeout(() => {
            onClick(button)
        }, 100)
    }
}
function handleButton(button) {
    button.addEventListener("click", () => {
        onClick(button)
    });
    if (answerTable[old_question] && (answerTable[old_question] == button.innerText || answerTable[old_question].includes(button.innerText))) {
        button.style.backgroundColor = "blueviolet"
        setTimeout( () => {
            button.click()
        }, 2000 )
    } else {
        button.style.backgroundColor = "darkgray"
        setTimeout( () => {
            button.style.backgroundColor = "cornflowerblue"
        }, 2000 )
    }
}

(function() {
    'use strict';

    // Your code here...

    answerTable = JSON.parse(localStorage.getItem(dataName)) || localStorage.setItem(dataName, JSON.stringify({}))

    handle()
})();

// Put the object into storage
//localStorage.setItem('testObject', JSON.stringify(testObject));

// Retrieve the object from storage
//var retrievedObject = localStorage.getItem('testObject');

//console.log('retrievedObject: ', JSON.parse(retrievedObject));