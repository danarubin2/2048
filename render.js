import Game from "./engine/game.js";
 
let game = null;
 
$(document).ready(() =>{
    /*
    When we load the document, we want to make a grid with
    our initial two tiles on it
    */
    game = new Game(4);
    //Uncomment out if you want to combine everything lol
    
    /*
    game.loadGame({
        board: [4, 4, 8, 16, 256, 128, 64, 32, 512, 1024, 2048, 4096, 65536, 32768, 16384, 8192],
        score: 0,
        won: false,
        over: false
    })
    */
    
    
    
    makeBoard(game.getGameState());
    
    $(document).on('keydown', function(key){
        handleKeyPress(key);
    });
 
    $("#restart").on('click', function(event){
        handleRestartButtonPress(event);
    })
 
    newGameFunctions();
});
 
export const handleKeyPress = function(key){
    switch(key.code){
        case 'ArrowUp':
            game.move('up');
            break;
        case 'ArrowDown':
            game.move('down');
            break;
        case 'ArrowRight':
            game.move('right');
            break;
        case 'ArrowLeft':
            game.move('left');
            break;
    }
    let scoreDiv = $("#score");
    scoreDiv.empty();
    scoreDiv.append("" + game.getGameState().score);
}
 
export const handleRestartButtonPress = function(event){
    game = new Game(4);

    let introDiv = $("#intro");
    introDiv.empty();
    let intro = `<h2 class="title">${"Welcome to 2048!"}</h2>
        <h4 class="subtitle">${`Use the arrow keys to move tiles, merging ones of
            the same value. Try to get to the 2048 tile!`}
        </h4>
        <h4 class="subtitle">${"Hit the arrow keys to begin."}</h4>`;
    introDiv.append(intro);

    let scoreDiv = $("#score");
    scoreDiv.empty();
    scoreDiv.append(0);

    makeBoard(game.getGameState());
    newGameFunctions();
}
 
let newGameFunctions = () =>{
    //Remake board on move
    game.onMove(gameState => {
        makeBoard(gameState);
    });
 
    //Show win message on win
    game.onWin(gameState => {
        winMessage(gameState);
    });
 
    //Show lose message on lose
    game.onLose(gameState => {
        loseMessage(gameState);
    });
}
 
let winMessage = (gameState) =>{
    let introDiv = $("#intro");
    introDiv.empty();
    let message = 
    `<h1 class="title">${"You won!"}</h1>
     <h3 class="subtitle">${"Keep playing to see how far you can get, or hit restart to start over!"}</h3>
    `;
    let instructions =
    `
     <h4 class="subtitle">${"And if you still need a reminder on how to play..."}</h4>
     <h5 class="subtitle">${"Use arrow keys to move tiles, merging ones of the same value :)"}</h5>
     `
    introDiv.append(message);
    introDiv.append(instructions);
}
 
let loseMessage = (gameState) =>{
    let introDiv = $("#intro");
    introDiv.empty();
    let message = 
    `<h1 class="title">${"Game Over!"}</h1>
     <h3 class="subtitle">${"Hit restart to play again :)"}</h3>
    `;
    introDiv.append(message);
}
 
let makeBoard = (gameState) => {
    let boardDiv = $("#board");
    let board = gameState.board;
    
    boardDiv.empty();
 
    let boardTable = $("<table></table>");
    for (let y = 0; y < 4; y++){
        let row = $("<tr></tr>");
        for (let x = 0; x < 4; x++){
            let spaceDiv = $("<div class='space'></div>");
            let space = board[(y*4) + x];
            spaceDiv.append(space);
            switch(space){
                case 0:
                    spaceDiv.addClass("s0");
                    spaceDiv.empty();
                    break;
                case 2:
                    spaceDiv.addClass("s2");
                    break;
                case 4:
                    spaceDiv.addClass("s4");
                    break;
                case 8:
                    spaceDiv.addClass("s8");
                    break;
                case 16:
                    spaceDiv.addClass("s16");
                    break;
                case 32:
                    spaceDiv.addClass("s32");
                    break;
                case 64:
                    spaceDiv.addClass("s64");
                    break;
                case 128:
                    spaceDiv.addClass("s128");
                    break;
                case 256:
                    spaceDiv.addClass("s256");
                    break;
                case 512:
                    spaceDiv.addClass("s512");
                    break;
                case 1024:
                    spaceDiv.addClass("s1024");
                    break;
                case 2048:
                    spaceDiv.addClass("s2048");
                    break;
                //Because we are extra and want cases/colors for every tile possible...
                case 4096:
                    spaceDiv.addClass("s4096");
                    break;
                case 8192:
                    spaceDiv.addClass("s8192");
                    break;
                case 16384:
                    spaceDiv.addClass("s16384");
                    break;
                case 32768:
                    spaceDiv.addClass("s32768");
                    break;
                case 65536:
                    spaceDiv.addClass("s65536");
                    break;
                default:
                    spaceDiv.addClass("largest");
                    break;
            }
            row.append($("<td></td>").append(spaceDiv));
        }
        boardTable.append(row);
    }
    boardDiv.append(boardTable);
}