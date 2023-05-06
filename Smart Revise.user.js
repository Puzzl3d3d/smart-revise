// ==UserScript==
// @name         AUTO Smart Revise Tampermonkey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autocompletes smart revise
// @author       You
// @match        https://smartrevise.online/student/revise/*
// @grant        none
// ==/UserScript==

const questionTextID = "questiontext";
const answerButtonID = "js_answerButton";
const noticeButtonClass = "swal2-confirm";
const nextButtonID = "lnkNext"
const questionImageID = "question_img"

const correctClass = "btn-success"
const incorrectClass = "btn-danger"

const dataName = "SR_Answers"

var answerTable

var old_question = ""

function handle() {
    //const questiontext = document.getElementById(questionTextID);
    //var question = questiontext.innerText
    const questiontext = (document.getElementById(questionImageID).src != "https://smartrevise.online/student/revise/Question/39" && document.getElementById(questionImageID)) || document.getElementById(questionTextID);
    var question = questiontext.src || questiontext.innerText
    console.log(question)
    if (question==old_question) {
        setTimeout( handle, 200 );
    } else {
        old_question = question

        var answerButtons = document.getElementsByClassName(answerButtonID);
        for (var i = 0; i < answerButtons.length; i++) {
            handleButton(answerButtons.item(i));
        }
    }
    setTimeout(() => {
         if (document.getElementsByClassName(noticeButtonClass)[0]) {
             document.getElementsByClassName(noticeButtonClass)[0].click();
         };
    }, 2000);
}
/*function handle() {
    var thisquestion = document.getElementById(questionTextID).innerText
    var timeout

    console.log("Handling new question '",thisquestion+"'", "'",old_question+"'")

    if (thisquestion == old_question) {
        document.getElementById(nextButtonID).click();

        for (timeout of timeouts) {
            clearTimeout(timeout);
        }
        timeouts.push(setTimeout( handle, 500 ))
    } else {
        for (timeout of timeouts) {
            clearTimeout(timeout);
        }
        old_question = "FUCK JAVASCRIPT MAN";
        question = thisquestion;
        console.log("CLEAR THE FUCKING THING OMG STFU STUPID JAVASCRIPT FUCK YOU ITS 1:45AM");
        var answerButtons = document.getElementsByClassName(answerButtonID);
        for (var i = 0; i < answerButtons.length; i++) {
            handleButton(answerButtons.item(i));
        }
    }
}*/
function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}
function getAnswerTable() {
   return JSON.parse(localStorage.getItem(dataName)) || localStorage.setItem(dataName, JSON.stringify({}))
}
function storeAnswer(answer) {
    var answerTable = getAnswerTable()

    console.log("length:",Object.keys(answerTable).length, "\n value already in table:",answerTable[old_question], "\n answer to store:",answer)

    if (answerTable[old_question]) {
        if (typeof(answerTable[old_question]) == "object") {
            if (!answerTable[old_question].includes(answer)) {
                answerTable[old_question].push(answer)
            }
        } else {
            if (!(answerTable[old_question] == answer)) {
                answerTable[old_question] = [answerTable[old_question], answer]
            }
        }
    } else {
        answerTable[old_question] = answer
    }

    localStorage.setItem(dataName, JSON.stringify(answerTable))
    localStorage.setItem("AnswersSaved", Object.keys(answerTable).length)

    console.log("length:",Object.keys(answerTable).length, "\n value already in table:",answerTable[old_question], "\n answer to store:",answer)

    answerTable = undefined
}
function unstoreAnswer(answer) {
    var answerTable = getAnswerTable()

    if (answerTable[old_question]) {
        if (typeof(answerTable[old_question]) == "object") {
            if (answerTable[old_question].includes(answer)) {
                const index = answerTable[old_question].indexOf(answer)
                answerTable[old_question].splice(index, 1)
            }
        } else {
            answerTable[old_question] = undefined
        }

        localStorage.setItem(dataName, JSON.stringify(answerTable))
        localStorage.setItem("AnswersSaved", Object.keys(answerTable).length)

        answerTable = undefined
    }
}
function onClick(button) {
    setTimeout( () => {
        console.log("Handling click")

        if (hasClass(button, correctClass) || hasClass(button, incorrectClass) ) {
            if (hasClass(button, correctClass)) {
                button.style.backgroundColor = "#1dc9b7";

                storeAnswer(button.innerText);
            } else {
                button.style.backgroundColor = "#fd397a"

                var correctButton = document.getElementsByClassName(correctClass)[0];

                correctButton.style.backgroundColor = "#1dc9b7"

                storeAnswer(correctButton.innerText);
                unstoreAnswer(button.innerText)

                localStorage.setItem("LAST_INCORRECT", old_question)
            }

            //handle()

            window.location.reload();
        } else {
            setTimeout(() => {
                onClick(button)
            }, 250)
            return
        }


   }, 0)
}
function handleButton(button) {
    button.addEventListener("click", () => {
        onClick(button)
    });
    button.disabled = true
    if (answerTable[old_question] && (answerTable[old_question] == button.innerText || (typeof(answerTable[old_question]) == "object" && answerTable[old_question].includes(button.innerText)))) {
        button.style.backgroundColor = "blueviolet"
        setTimeout( () => {
            button.disabled = false
            button.click()

            setTimeout(()=>{window.location.reload();}, 1000)
        }, 3000 )
    } else {
        button.style.backgroundColor = "darkgray"
        setTimeout( () => {
            button.disabled = false
            button.style.backgroundColor = "cornflowerblue"

            setTimeout( () => {
                button.click()

                setTimeout(()=>{window.location.reload();}, 1000)
            }, 200 + Math.random()*30)
        }, 3000 )
    }
}

(function() {
    'use strict';

    // Your code here...

    answerTable = JSON.parse(localStorage.getItem(dataName)) || localStorage.setItem(dataName, JSON.stringify({}))

    document.getElementById(nextButtonID).disabled = true

    handle()
})();

// Put the object into storage
//localStorage.setItem('testObject', JSON.stringify(testObject));

// Retrieve the object from storage
//var retrievedObject = localStorage.getItem('testObject');

//console.log('retrievedObject: ', JSON.parse(retrievedObject));
