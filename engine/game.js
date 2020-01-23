
/*
Add your code for Game here
 */

 export default class Game{

    constructor(size){
        //Initialize fields
        this.size = size;
        this.gameState = {
            board: [],
            score: Number,
            won: Boolean,
            over: Boolean
        }
        this.setupNewGame();
        this.moveFunctions = [];
        this.winFunctions = [];
        this.loseFunctions = [];
    }

    setupNewGame(){
        this.gameState = {
            board: [],
            score: Number,
            won: Boolean,
            over: Boolean
        }
        let index1 = Math.floor(Math.random() * (this.size*this.size));
        let index2 = Math.floor(Math.random() * (this.size*this.size));
        while (index1 == index2){
            index2 = Math.floor(Math.random() * (this.size*this.size));
        }
        for (let i = 0; i < this.size*this.size; i++){
            if (i == index1){
                if (Math.random() < 0.9){
                    this.gameState.board.push(2);
                }else{
                    this.gameState.board.push(4);
                }
            }
            else if (i == index2){
                if (Math.random() < 0.9){
                    this.gameState.board.push(2);
                }else{
                    this.gameState.board.push(4);
                }
            }
            else{
                this.gameState.board.push(0);
            }
        }
        this.gameState.score = 0;
        this.gameState.won = false;
        this.gameState.over = false;
    }

    loadGame(gameState){
        this.gameState = gameState;
    }

    move(direction){
        if (!this.gameState.over){
            let moved = false;
            let toAdd = 0;
            switch(direction){
                case 'up':
                     /*
                    First, we want to shift everything up as much as it can.
                    We will start in the second row, since it's the first row
                    that will be able to move up (meaning, the spot above the
                    current index is 0)
                    */
                    for (let i = this.size; i < this.size*this.size; i++){
                        //Don't need to shift everything if current spot is 0
                        if (this.gameState.board[i] != 0){
                            //Current acts like a pointer to the top of the column
                            let current = i;
                            //While spot above current is empty...
                            while(current >= this.size && this.gameState.board[current - this.size] == 0){
                                //Shift the whole column up one slot
                                for (let j = current; j < this.size*this.size; j+=this.size){
                                    this.gameState.board[j-this.size] = this.gameState.board[j];
                                    //Make sure to set last spot to zero
                                    if (j + this.size >= this.size*this.size){
                                        this.gameState.board[j] = 0;
                                    }
                                }    
                                //Update current to new top of column
                                current -= this.size;
                                moved = true;
                            }
                        }
                    }
                    /*
                    Now, we want to merge whatever tiles we can.
                    */
                    for (let i = 0; i < this.size*this.size; i++){
                        //Same, so combine
                        if (this.gameState.board[i] != 0 &&
                            this.gameState.board[i] == this.gameState.board[i + this.size]){
                                this.gameState.board[i] *= 2;
                                this.gameState.board[i+this.size] = 0;
                                toAdd += this.gameState.board[i];
                                if (this.gameState.board[i] == 2048){
                                    this.gameState.won = true;
                                    for (let i = 0; i < this.winFunctions.length; i++){
                                        this.winFunctions[i](this.gameState);
                                    }
                                }
                                moved = true;
                        }
                    }
                    //Shift again
                    for (let i = this.size; i < this.size*this.size; i++){
                        if (this.gameState.board[i] != 0){
                            let current = i;
                            while(current >= this.size && this.gameState.board[current - this.size] == 0){
                                for (let j = current; j < this.size*this.size; j+=this.size){
                                    this.gameState.board[j-this.size] = this.gameState.board[j];
                                    if (j + this.size >= this.size*this.size){
                                        this.gameState.board[j] = 0;
                                    }
                                }    
                                current -= this.size;
                            }
                        }
                    }
                break;
                case 'down':
                     /*
                    First, want to shift everything as far down as possible.
                    We can start at index 0 and go to the second to last row,
                    since that's the last thing that can be shifted down
                    */
                    for (let i = 0; i < this.size*(this.size - 1); i++){
                        //Don't need to shift everything if current spot is 0
                        if (this.gameState.board[i] != 0){
                            //Current acts like a pointer to the bottom of the column
                            let current = i;
                            //While spot below current is empty...
                            while(current < this.size*(this.size - 1) && this.gameState.board[current + this.size] == 0){
                                //Shift the whole column down one slot
                                for (let j = current; j >= 0; j-=this.size){
                                    this.gameState.board[j+this.size] = this.gameState.board[j];
                                    //Make sure to set last spot to zero
                                    if (j - this.size < this.size*this.size){
                                        this.gameState.board[j] = 0;
                                    }
                                }    
                                //Update current to new bottom of column
                                current += this.size;
                                moved = true;
                            }
                        }
                    }
                    /*
                    Now, we want to merge whatever tiles we can.
                    Start at the bottom of the board, since we are "pushing"
                    against that wall.
                    */
                    for (let i = this.size*this.size - 1; i >= this.size; i--){
                        if (this.gameState.board[i] != 0 &&
                            this.gameState.board[i] == this.gameState.board[i - this.size]){
                                this.gameState.board[i] *= 2;
                                this.gameState.board[i - this.size] = 0;
                                toAdd += this.gameState.board[i];
                                if (this.gameState.board[i] == 2048){
                                    this.gameState.won = true;
                                    for (let i = 0; i < this.winFunctions.length; i++){
                                        this.winFunctions[i](this.gameState);
                                    }
                                }
                                moved = true;
                            }
                    }
                    //Shift again
                    for (let i = 0; i < this.size*(this.size - 1); i++){
                        if (this.gameState.board[i] != 0){
                            let current = i;
                            while(current < this.size*(this.size - 1) && this.gameState.board[current + this.size] == 0){
                                for (let j = current; j >= 0; j-=this.size){
                                    this.gameState.board[j+this.size] = this.gameState.board[j];
                                    if (j - this.size < this.size*this.size){
                                        this.gameState.board[j] = 0;
                                    }
                                }    
                                current += this.size;
                            }
                        }
                    }
                break;
                case 'right':
                    /*
                    First, we will want to shift everything as far to the right
                    as possible. We can start at the second to last index. We will
                    leave off the last spot in every row, since it can't be shfited right.
                    Want to work backwards so when we shift, we are shifting the 
                    rightmost nonzero index and anything after it
                    */
                    for (let i = (this.size*this.size - 2); i >= 0; i--){
                        /*
                        Only dealing with first size - 1 in a row of this.size items.
                        Also check for not equaling 0 since we want to shift the first nonzero part
                        */
                        if ((((i + 1) % this.size) != 0) && (this.gameState.board[i] != 0)){
                            //Current is pointer to rightmost nonzero part
                            let current = i;
                            while ((current + 1 < this.size*this.size &&
                                this.gameState.board[current + 1] == 0) && ((current + 1) % this.size != 0)){
                                /*
                                Want to shift the row, but we want to know how many items to shift.
                                For example, if current is 10, we want to shift indexes 8, 9, and 10.
                                So start at current is 10, subtract 1 each time, and go until start of row
                                */
                                let j = current + 1;
                                do{
                                    j--;
                                    this.gameState.board[j + 1] = this.gameState.board[j];
                                    if ((j - 1) % this.size == (this.size - 1) || (j - 1) < 0){
                                        this.gameState.board[j] = 0;
                                    }
                                } while ((j - 1) % this.size != (this.size - 1) && j > 0);
                                current++;
                                moved = true;
                            }
                        }
                    }
                    /*
                    Now, we want to merge whatever tiles we can. We will
                    start at the end of the array, since we are pushing against the right
                    wall. So, we want to combine things on the right wall first.
                    Since we are pushing on the right wall, we want to skip indexes in the
                    start of the row, since we will compare the current to what is before it.
                    We don't want to combine something on a 4x4 grid like indexes 4 and 3, since
                    they're in different rows. Skip all indexes mod 4 = 0
                    */
                    for (let i = this.size*this.size - 1; i > 0; i--){
                        //Something that we can combine what's to the left
                        if (i % this.size != 0 && this.gameState.board[i] != 0 &&
                            this.gameState.board[i] == this.gameState.board[i - 1]){
                                this.gameState.board[i] *= 2;
                                this.gameState.board[i - 1] = 0;
                                toAdd += this.gameState.board[i];
                                if (this.gameState.board[i] == 2048){
                                    this.gameState.won = true;
                                    for (let i = 0; i < this.winFunctions.length; i++){
                                        this.winFunctions[i](this.gameState);
                                    }
                                }
                                moved = true;
                        }
                    }
                    //Shift again
                    for (let i = (this.size*this.size - 2); i >= 0; i--){
                        if ((((i + 1) % this.size) != 0) && (this.gameState.board[i] != 0)){
                            let current = i;
                            while ((current + 1 < this.size*this.size &&
                                this.gameState.board[current + 1] == 0) && ((current + 1) % this.size != 0)){
                                let j = current + 1;
                                do{
                                    j--;
                                    this.gameState.board[j + 1] = this.gameState.board[j];
                                    if ((j - 1) % this.size == (this.size - 1) || (j - 1) < 0){
                                        this.gameState.board[j] = 0;
                                    }
                                } while ((j - 1) % this.size != (this.size - 1) && j > 0);
                                current++;
                            }
                        }
                    }
                break;
                case 'left':
                    /*
                    First, we will want to shift everything as far to the left
                    as possible. We can start at index 1. We will leave off the first
                    spot in every row, since it can't be shifted left. Want to always
                    be shifting the leftmost nonzero index and anything to the right of it 
                    */
                    for (let i = 1; i < this.size*this.size; i++){
                        /*
                        Only dealing with last size - 1 items in a row of size items
                        Also check for not equaling 0 since we want to shift the first nonzero part
                        */
                        if (((i % this.size) != 0) && (this.gameState.board[i] != 0)){
                            //Current is pointer to leftmost nonzero part
                            let current = i;
                            while ((current - 1 >= 0 &&
                                this.gameState.board[current - 1] == 0) && (current % this.size != 0)){
                                /*
                                Want to shift the row, but we want to know how many items to shift.
                                For example, if current is 10, we want to shift indexes 8, 9, and 10.
                                So start at current is 10, subtract 1 each time, and go until start of row
                                */
                                let j = current - 1;
                                do{
                                    j++;
                                    this.gameState.board[j - 1] = this.gameState.board[j];
                                    if ((j + 1) % this.size == 0 || (j + 1) >= this.size*this.size){
                                        this.gameState.board[j] = 0;
                                    }
                                } while ((j + 1) % this.size != 0 && j < this.size*this.size);
                                current--;
                                moved = true;
                            }
                        }
                    }
                    /*
                    Now, we want to merge whatever tiles we can. We will start at the
                    front of the array, since we are pushing against the left wall. So, we want
                    to combine things on the left wall first. Since we are pushing on the left wall,
                    we want to skip indexes at the end of the row, since we will compare current
                    to what is after it. We don't want to combine something on a 4x4 grid like
                    indexes 3 and 4, since they're in different rows. Skip indexes mod size = size - 1
                    */
                    for (let i = 0; i < this.size*this.size - 1; i++){
                        //Something that we can combine what's to the right
                        if ((i % this.size) != this.size - 1 && this.gameState.board[i] != 0 &&
                            this.gameState.board[i] == this.gameState.board[i + 1]){
                                this.gameState.board[i] *= 2;
                                this.gameState.board[i + 1] = 0;
                                toAdd += this.gameState.board[i];
                                if (this.gameState.board[i] == 2048){
                                    this.gameState.won = true;
                                    for (let i = 0; i < this.winFunctions.length; i++){
                                        this.winFunctions[i](this.gameState);
                                    }
                                }
                                moved = true;
                            }
                    }
                    //Shift again
                    for (let i = 1; i < this.size*this.size; i++){
                        if (((i % this.size) != 0) && (this.gameState.board[i] != 0)){
                            let current = i;
                            while ((current - 1 >= 0 &&
                                this.gameState.board[current - 1] == 0) && (current % this.size != 0)){
                                let j = current - 1;
                                do{
                                    j++;
                                    this.gameState.board[j - 1] = this.gameState.board[j];
                                    if ((j + 1) % this.size == 0 || (j + 1) >= this.size*this.size){
                                        this.gameState.board[j] = 0;
                                    }
                                } while ((j + 1) % this.size != 0 && j < this.size*this.size);
                                current--;
                            }
                        }
                    }           
                    break;
                }
            if (moved){
                this.addTile();
            }
            for (let i = 0; i < this.moveFunctions.length; i++){
                this.moveFunctions[i](this.gameState);
            }
            if (this.gameState.over){
                for (let i = 0; i < this.loseFunctions.length; i++){
                    this.loseFunctions[i](this.gameState);
                }
            }
            this.gameState.score += toAdd;
        }  
    }

    toString(){
        let s = "";
        for (let i = 0; i < this.size*this.size; i++){
            s += this.gameState.board[i] + "  ";
            if ((i + 1) % this.size == 0){
                s += "\n";
            } 
        }
        s += "\n";
        s += "Score: " + this.gameState.score + "\n"; 
        s += "Over: " + this.gameState.over + "\n";
        s += "Won: " + this.gameState.won + "\n";
        return s;
    }

    onMove(callback){
        this.moveFunctions.push(callback);
    }

    onWin(callback){
        this.winFunctions.push(callback);
    }

    onLose(callback){
        this.loseFunctions.push(callback);
    }

    getGameState(){
        return this.gameState;
    }

    addTile(){
        //Check if there's any space to add a tile
        let spaces = 0;
        for (let i = 0; i < this.size*this.size; i++){
            if (this.gameState.board[i] == 0){
                spaces++;
            }
        }
        if (spaces > 0){
            let index = Math.floor(Math.random() * (this.size*this.size));
            while (this.gameState.board[index] != 0){
                index = Math.floor(Math.random() * (this.size*this.size));
            }
            if (Math.random() < 0.9){
                this.gameState.board[index] = 2;
            }else{
                this.gameState.board[index] = 4;
            }        
        }
        //If there's no space, make sure that game isn't over!
        if (spaces < 2){
            let end = true;
            for (let i = 0; i < this.size*this.size; i++){
                //Check right neighbor, if it exists
                if (this.gameState.board[i + 1]
                    && this.gameState.board[i] == this.gameState.board[i + 1]
                    && Math.floor(i / this.size) == Math.floor((i + 1) / this.size)){
                        end = false;
                        break;
                }
                //Check left neighbor, if it exists
                if (this.gameState.board[i - 1]
                    && this.gameState.board[i] == this.gameState.board[i - 1]
                    && Math.floor(i / this.size) == Math.floor((i - 1) / this.size)){
                        end = false;
                        break;
                }
                //Check up neighbor, if it exists
                if (this.gameState.board[i - this.size]
                    && this.gameState.board[i] == this.gameState.board[i - this.size]){
                        end = false;
                        break;
                }
                //Check down neighbor, if it exists
                if (this.gameState.board[i + this.size]
                    && this.gameState.board[i] == this.gameState.board[i + this.size]){
                        end = false;
                        break;
                }
            }
            if (end){
                this.gameState.over = true;
            }
        }
    }
 }