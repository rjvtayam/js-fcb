// console.log("Hello world");

// variables - storage and representer of values

// variable
let board;

// variables with value
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

let startX = 0;
let startY = 0;

function setGame(){

	// Create a game board
	board = [
	 	[0, 0, 0, 0],
	 	[0, 0, 0, 0],
	 	[0, 0, 0, 0],
	 	[0, 0, 0, 0]
	];

	// We use 2 loops (1 loop with nested loop) since we are dealing with 2 dimensional
	// These 2 loops (1 loop with nested loop) will assure that the task inside will be executed 16 times (or when it is in the rows or columns limit already );
	for(let r=0; r <rows; r++){
	 	for(let c=0; c < columns; c++){

	 		// Create a div element for our tile
	 		let tile = document.createElement("div");

	 		// the tile will have its id based on its row and column position
	 		tile.id = r.toString() + "-" + c.toString();

	 		// we retrieve the number from our tile in our board
	 		let num = board[r][c];

	 		// and we used the number to update the tile's appearance
	 		updateTile(tile, num);

	 		// This is to add/insert (append) a tile in the board for us to see the tiles
	 		document.getElementById("board").append(tile);
	 	}
	}

	setTwo();
	setTwo();
}


// updateTile() - responsible for updating the tile's appearance
function updateTile(tile, num){
	tile.innerText = "";
	tile.classList.value = "";

	// add class named "tile"
	tile.classList.add("tile");

	if(num > 0){

		// We display the tile number to the actual tile 
		tile.innerText = num.toString();

		// The code below will assure that tile color / appearance will be updated once it will be a numbered tile
		if(num <= 4096){
			tile.classList.add("x"+num);
		}
		else{
			tile.classList.add("x8192");
		}
	}
}

window.onload = function() {
	setGame();
}


function handleSlide(e){
	// Logs to the console the e.code;
	// e.code - the key we have pressed on the keydown event.
	console.log(e.code);

	//event.preventDefault() - it prevent the default behavior of the browser during an event
	e.preventDefault(); 

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){

		if(e.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		}
		else if(e.code == "ArrowRight"){
			slideRight();
			setTwo();
		}
		else if(e.code == "ArrowUp"){
			slideUp();
			setTwo();
		}
		else if(e.code == "ArrowDown"){
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;

	setTimeout(() => {
		if(hasLost() == true){
			alert("Game over! You have lost the game. Game will restart");
			restartGame();
			alert("Click any arrow key to restart");
		}
		else{
			checkWin();
		}
	}, 100)
}



// We added a event listener in our document, that will specifically listen to keydown (whenever we press a key) event, and executes / call handleSlide function whenever there is a keydown event.
document.addEventListener("keydown", handleSlide);



function slideLeft(){
	for(let r=0; r<rows; r++){
		let row = board[r];

		//Documents the original position of the tiles
		let originalRow = row.slice();

		row = slide(row);
		board[r] = row;

		for (let c=0; c<columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-right 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}
			updateTile(tile, num);
		}
	}
}

function slideRight(){
	for(let r=0; r<rows; r++){
		let row = board[r];

		let originalRow = row.slice();

		row.reverse()
		row = slide(row);
		row.reverse();
		board[r] = row;

		for (let c=0; c<columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-left 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}
			updateTile(tile, num);
		}
	}
}

function slideUp(){
	for(let c=0; c<columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

		let originalCol = col.slice();

		// Slide left will use slide function for merging tiles
		col = slide(col);

		for (let r=0; r<rows; r++){

			board[r][c] = col[r];

			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if(originalCol[r] !== num && num !== 0){
				tile.style.animation = "slide-from-bottom 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}

			updateTile(tile, num);
		}
	}
}

function slideDown(){
	for(let c=0; c<columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		
		let originalCol = col.slice();

		col.reverse();
		col = slide(col);
		col.reverse();
		
		for (let r=0; r<rows; r++){

			board[r][c] = col[r];

			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if(originalCol[r] !== num && num !== 0){
				tile.style.animation = "slide-from-top 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}
			updateTile(tile, num);
		}
	}
}
// The main responsible for merging tiles
function slide(tiles){

	tiles = filterZero(tiles);

	for(let i=0; i<tiles.length-1; i++){

		if(tiles[i] == tiles[i+1]){
			tiles[i] *= 2;
			tiles[i+1] = 0;
			score += tiles[i];
			//score = score + tiles[i]
		}
	}

	tiles = filterZero(tiles);

	while(tiles.length < columns){
		tiles.push(0);
	}

	return tiles;
}

function filterZero(tiles){
	return tiles.filter(num => num != 0);
}


// This function will check each of the tile in the board, if there is an empty tile
function hasEmptyTile(){
	for(let r=0; r <rows; r++){
	 	for(let c=0; c < columns; c++){

	 		if(board[r][c] == 0){
	 			return true;
	 		}
	 	}
	}
	return false;
}

function setTwo(){
	// If hasEmptyTile function returns false, it will do nothing, meaning it will not generate a new tile. 
	if(hasEmptyTile() == false){
		return; 
	}
	// The code below will find an empty tile using random coordinates
	let found = false;
	while(!found){

		// This is to generate random row and column of position / random coordinate
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		// if the random tile is equal to zero (empty tile)
		if(board[r][c] == 0){
			// make the random empty tile to a tile with number 2
			board[r][c] = 2;
			// update the random tile appearance
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}
	}
}


function checkWin(){
	for(let r=0; r <rows; r++){
	 	for(let c=0; c < columns; c++){

	 		if(board[r][c] == 2048 && is2048Exist == false){
	 			alert("You Win! You got the 2048");
	 			is2048Exist = true;
	 		}
	 		else if(board[r][c] == 4096 && is4096Exist == false){
	 			alert("You are unstoppable at 4096! Fantastic!");
	 			is4096Exist = true;
	 		}
	 		else if(board[r][c] == 8192 && is8192Exist == false){
	 			alert("Victory! You ave reached 8192!");
	 			is4096Exist = true;
	 		}
	 	}
	}
}

function hasLost(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c] == 0 ){
				return false;
			}
			
			const currentTile = board[r][c];

			if(
				r > 0 && currentTile === board[r-1][c] ||
				r < rows - 1 &&  currentTile === board[r+1][c] || 
				c > 0 && currentTile === board[r][c-1] ||
				c < columns -1 && board[r][c+1] === currentTile
			){
				return false;
			}
		}
	}
	return true;
}

function restartGame(){
	board = [
	 	[0, 0, 0, 0],
	 	[0, 0, 0, 0],
	 	[0, 0, 0, 0],
	 	[0, 0, 0, 0]
	];

	score = 0;

	setTwo();
}


document.addEventListener("touchstart", (e) => {
	console.log("touchstart event")

	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
})


document.addEventListener("touchend", (e) =>{

	console.log("touchend event")

	if(!e.target.className.includes("tile")){
		return;
	}

	diffX = startX - e.changedTouches[0].clientX;
	diffY = startY - e.changedTouches[0].clientY;
	

	if(diffX !== 0 && diffY !== 0){

		if(Math.abs(diffX) > Math.abs(diffY)){
			slideLeft();
			setTwo();
		}
		else{
			slideRight();
			setTwo();
		}
	}
	else{
		if(diffY > 0){
			slideUp();
			setTwo();
		}
		else{
			slideDown();
			setTwo();
		}
	}
})



