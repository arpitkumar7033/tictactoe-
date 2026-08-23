// ================================
// Tic Tac Toe - Fixed Version
// Part 1
// ================================


// Select Elements

const cells = document.querySelectorAll(".cell");

const restartBtn = document.getElementById("restart");

const statusText = document.getElementById("status");

const themeBtn = document.getElementById("themeBtn");


const xScoreText = document.getElementById("xScore");
const oScoreText = document.getElementById("oScore");
const drawScoreText = document.getElementById("drawScore");


const menu = document.getElementById("menu");
const game = document.getElementById("game");


const friendBtn = document.getElementById("friendBtn");
const computerBtn = document.getElementById("computerBtn");


const resultScreen = document.getElementById("resultScreen");
const resultText = document.getElementById("resultText");


const playAgain = document.getElementById("playAgain");
const backMenu = document.getElementById("backMenu");


const easyBtn = document.getElementById("easy");
const mediumBtn = document.getElementById("medium");
const hardBtn = document.getElementById("hard");

const playerXInput =
document.getElementById("playerX");


const playerOInput =
document.getElementById("playerO");

const streakText =
document.getElementById("streak");

const soundBtn =
document.getElementById("soundBtn");


// Variables


let currentPlayer = "X";

let gameOver = false;

let moves = 0;

let difficulty = "easy";

let aiMode = true;

let playerXName="Player X";

let playerOName="Player O";


let xStreak=0;

let oStreak=0;

let soundOn=true;

// Sounds

const clickSound = new Audio(
    "sounds/click.mp3"
);


const winSound = new Audio(
    "sounds/win.mp3"
);


const drawSound = new Audio(
    "sounds/draw.mp3"
);

// Score

let xScore = Number(localStorage.getItem("xScore")) || 0;

let oScore = Number(localStorage.getItem("oScore")) || 0;

let drawScore = Number(localStorage.getItem("drawScore")) || 0;



xScoreText.textContent = xScore;

oScoreText.textContent = oScore;

drawScoreText.textContent = drawScore;





// Winning Positions


const winningCombinations = [

[0,1,2],
[3,4,5],
[6,7,8],

[0,3,6],
[1,4,7],
[2,5,8],

[0,4,8],
[2,4,6]

];





// Winner Check


function checkWinner(){


for(let combo of winningCombinations){


let a = cells[combo[0]];

let b = cells[combo[1]];

let c = cells[combo[2]];



if(
a.textContent !== "" &&
a.textContent === b.textContent &&
b.textContent === c.textContent
){


a.classList.add("win");

b.classList.add("win");

c.classList.add("win");


gameOver = true;



if(a.textContent==="X"){


xScore++;

xScoreText.textContent=xScore;

localStorage.setItem("xScore",xScore);


}
else{


oScore++;

oScoreText.textContent=oScore;

localStorage.setItem("oScore",oScore);


}



if(a.textContent==="X"){

    xStreak++;

    oStreak=0;

    resultText.textContent =
    playerXInput.value+" Wins! 🏆";


}

else{


    oStreak++;

    xStreak=0;

    resultText.textContent =
    playerOInput.value+" Wins! 🏆";


}

streakText.textContent =
"🔥 Streak: "+
Math.max(xStreak,oStreak);


setTimeout(()=>{

resultScreen.style.display="block";

},500);



return true;


}



}




// Draw


if(moves===9){


gameOver=true;


drawScore++;

drawScoreText.textContent=drawScore;


localStorage.setItem("drawScore",drawScore);



resultText.textContent="Match Draw 🤝";


setTimeout(()=>{

resultScreen.style.display="block";

},500);



return true;


}


return false;


}

// ================================
// Cell Click
// ================================


cells.forEach(cell=>{


    cell.addEventListener("click",()=>{


        if(gameOver) return;


        if(cell.textContent!=="") return;



        // Computer mode में सिर्फ X खेलेगा

        if(aiMode && currentPlayer!=="X"){

            return;

        }



        cell.textContent=currentPlayer;

        if(soundOn){

    clickSound.play();

}

        cell.classList.add(
            currentPlayer.toLowerCase()
        );



        moves++;



        if(checkWinner()){

            return;

        }



        // Computer Turn

        if(aiMode){


            currentPlayer="O";


            statusText.textContent="Computer Turn";


            setTimeout(computerMove,500);


        }

        else{


            currentPlayer =
            currentPlayer==="X" ? "O" : "X";


            statusText.textContent =
            "Player "+currentPlayer+" Turn";


        }



    });


});






// ================================
// Smart Computer Move
// ================================

function computerMove(){

    if(gameOver) return;


    let move;



    // Easy Mode
    if(difficulty==="easy"){


        move=randomMove();


    }



    // Medium Mode
    else if(difficulty==="medium"){


        // Computer जीत सकता है तो जीतेगा

        move=findBestMove("O");



        // अगर नहीं जीत सकता तो X को रोकेगा

        if(move===-1){

            move=findBestMove("X");

        }



        // अगर दोनों नहीं मिले तो random

        if(move===-1){

            move=randomMove();

        }


    }

    else if(difficulty==="hard"){

    move=bestMove();

}


    if(move===undefined) return;



    cells[move].textContent="O";


    cells[move].classList.add("o");


    moves++;



    if(checkWinner()){

        return;

    }



    currentPlayer="X";


    statusText.textContent="Player X Turn";

}






// Random Move


function randomMove(){


    let empty=[];



    cells.forEach((cell,index)=>{


        if(cell.textContent===""){


            empty.push(index);


        }


    });



    if(empty.length===0){

        return;

    }



    return empty[
        Math.floor(Math.random()*empty.length)
    ];

}

// ================================
// Alpha Beta Pruning AI
// ================================


function bestMove(){

    let bestScore = -Infinity;

    let move;


    for(let i=0; i<cells.length; i++){


        if(cells[i].textContent===""){


            cells[i].textContent="O";


            let score = minimax(
                false,
                -Infinity,
                Infinity
            );


            cells[i].textContent="";


            if(score > bestScore){

                bestScore = score;

                move = i;

            }

        }

    }


    return move;

}





function minimax(isMaximizing, alpha, beta){



    if(isWinning("O")){

        return 1;

    }


    if(isWinning("X")){

        return -1;

    }


    if(isBoardFull()){

        return 0;

    }





    if(isMaximizing){


        let bestScore = -Infinity;



        for(let i=0;i<cells.length;i++){


            if(cells[i].textContent===""){



                cells[i].textContent="O";



                let score = minimax(
                    false,
                    alpha,
                    beta
                );



                cells[i].textContent="";



                bestScore = Math.max(
                    score,
                    bestScore
                );



                alpha = Math.max(
                    alpha,
                    bestScore
                );



                // Alpha Beta Cut

                if(beta <= alpha){

                    break;

                }


            }


        }



        return bestScore;



    }



    else{


        let bestScore = Infinity;



        for(let i=0;i<cells.length;i++){



            if(cells[i].textContent===""){



                cells[i].textContent="X";



                let score = minimax(
                    true,
                    alpha,
                    beta
                );



                cells[i].textContent="";



                bestScore = Math.min(
                    score,
                    bestScore
                );



                beta = Math.min(
                    beta,
                    bestScore
                );



                // Alpha Beta Cut

                if(beta <= alpha){

                    break;

                }


            }


        }



        return bestScore;


    }


}






function isWinning(player){


    for(let combo of winningCombinations){


        let a=cells[combo[0]].textContent;

        let b=cells[combo[1]].textContent;

        let c=cells[combo[2]].textContent;



        if(
            a===player &&
            b===player &&
            c===player
        ){

            return true;

        }


    }


    return false;


}






function isBoardFull(){


    for(let cell of cells){


        if(cell.textContent===""){


            return false;

        }


    }


    return true;


}

// ================================
// Smart AI - Find Best Move
// ================================

function findBestMove(player){

    let empty=[];


    cells.forEach((cell,index)=>{

        if(cell.textContent===""){

            empty.push(index);

        }

    });



    for(let index of empty){


        cells[index].textContent=player;



        if(isWinning(player)){


            cells[index].textContent="";


            return index;

        }



        cells[index].textContent="";


    }



    return -1;

}





function isWinning(player){


    for(let combo of winningCombinations){


        let a=cells[combo[0]].textContent;

        let b=cells[combo[1]].textContent;

        let c=cells[combo[2]].textContent;



        if(
            a===player &&
            b===player &&
            c===player
        ){

            return true;

        }


    }


    return false;

}

// ================================
// Minimax AI - Hard Mode
// ================================


function bestMove(){

    let bestScore = -Infinity;

    let move;


    for(let i=0;i<cells.length;i++){


        if(cells[i].textContent===""){


            cells[i].textContent="O";


            let score = minimax(false);


            cells[i].textContent="";


            if(score > bestScore){

                bestScore = score;

                move = i;

            }


        }


    }


    return move;

}





function minimax(isMaximizing){


    if(isWinning("O")){

        return 1;

    }


    if(isWinning("X")){

        return -1;

    }


    if(isBoardFull()){

        return 0;

    }



    if(isMaximizing){


        let bestScore = -Infinity;



        for(let i=0;i<cells.length;i++){


            if(cells[i].textContent===""){


                cells[i].textContent="O";


                let score=minimax(false);


                cells[i].textContent="";


                bestScore=Math.max(score,bestScore);


            }


        }



        return bestScore;


    }


    else{


        let bestScore = Infinity;



        for(let i=0;i<cells.length;i++){


            if(cells[i].textContent===""){


                cells[i].textContent="X";


                let score=minimax(true);


                cells[i].textContent="";


                bestScore=Math.min(score,bestScore);


            }


        }



        return bestScore;


    }


}






function isBoardFull(){


    for(let cell of cells){


        if(cell.textContent===""){


            return false;

        }


    }


    return true;

}

function findBestMove(player){


let empty=[];


cells.forEach((cell,index)=>{

    if(cell.textContent===""){

        empty.push(index);

    }

});



for(let index of empty){


    cells[index].textContent=player;



    if(isWinning(player)){


        cells[index].textContent="";


        return index;

    }



    cells[index].textContent="";


}



return -1;


}




function isWinning(player){


for(let combo of winningCombinations){


let a=cells[combo[0]].textContent;

let b=cells[combo[1]].textContent;

let c=cells[combo[2]].textContent;



if(
a===player &&
b===player &&
c===player
){

return true;

}


}


return false;


}




// ================================
// Theme
// ================================


themeBtn.addEventListener("click",()=>{


    document.body.classList.toggle("light");



    if(document.body.classList.contains("light")){


        themeBtn.textContent="🌑 Dark Mode";


    }

    else{


        themeBtn.textContent="🌙 Light Mode";


    }


});

// ================================
// Sound Toggle
// ================================


soundBtn.addEventListener("click",()=>{


    soundOn=!soundOn;



    if(soundOn){


        soundBtn.textContent="🔊 Sound ON";


    }

    else{


        soundBtn.textContent="🔇 Sound OFF";


    }


});




// ================================
// Restart
// ================================


restartBtn.addEventListener("click",()=>{


    cells.forEach(cell=>{


        cell.textContent="";


        cell.classList.remove("x");

        cell.classList.remove("o");

        cell.classList.remove("win");


    });



    currentPlayer="X";

    gameOver=false;

    moves=0;



    statusText.textContent="Player X Turn";


});







// ================================
// Game Mode
// ================================


friendBtn.addEventListener("click",()=>{


    aiMode=false;


    menu.style.display="none";


    game.style.display="flex";


    statusText.textContent="Player X Turn";


});





computerBtn.addEventListener("click",()=>{


    aiMode=true;


    menu.style.display="none";


    game.style.display="flex";


    statusText.textContent="Player X Turn";


});






// ================================
// Result Buttons
// ================================


playAgain.addEventListener("click",()=>{


    resultScreen.style.display="none";


    restartBtn.click();


});





backMenu.addEventListener("click",()=>{


    resultScreen.style.display="none";


    game.style.display="none";


    menu.style.display="flex";


    restartBtn.click();


});







// ================================
// Difficulty
// ================================


easyBtn.addEventListener("click",()=>{


    difficulty="easy";


});



mediumBtn.addEventListener("click",()=>{


    difficulty="medium";


});



hardBtn.addEventListener("click",()=>{


    difficulty="hard";


});

const socket = io();
let mySymbol = null;
let currentTurn = 'X';
let gameActive = false;

// Player Symbol Receive karein (X ya O)
socket.on('playerAssigned', (data) => {
    mySymbol = data.symbol;
    console.log(`Aapka symbol: ${mySymbol}`);
});

socket.on('gameStart', (data) => {
    gameActive = true;
    alert("Dono players connect ho gaye! Game Shuru.");
});

socket.on('full', (msg) => alert(msg));

// Box click event
document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (gameActive && currentTurn === mySymbol && cell.innerText === '') {
            socket.emit('makeMove', { index: index, symbol: mySymbol });
        }
    });
});

// Dusre player ka move board par dikhayein
socket.on('moveMade', (data) => {
    const cells = document.querySelectorAll('.cell');
    cells[data.index].innerText = data.symbol;
    currentTurn = data.nextTurn;
});

socket.on('playerLeft', (msg) => {
    alert(msg);
    location.reload();
});

