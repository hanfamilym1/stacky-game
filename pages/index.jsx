import React, {useState, useEffect} from 'react';


const HomePage = () => {
  // initializes the board
  const numberArray = [2,2,2,2, 4, 4, 8, 8, 16, 16, 32, 32, 64, 64, 'W', 'BOMB'];
  const [board, setBoard] = useState( Array(36).fill(0));
  const [position, setPosition] = useState(Math.floor(Math.random() * 4))
  const initialNumbers = [2,2,2,2,4,4,8,8];
  const randomNumber = Math.floor(Math.random()* initialNumbers.length);
  const [piece, setPiece] = useState(initialNumbers[randomNumber]);
  const [reset, setReset] = useState(false);
  
// sets the board with the initial numbers
useEffect(() => {
    const newBoard = [...board];
    newBoard[position] = piece;
    setBoard(newBoard);
}, [reset])

// piece falls every second until it hits the bottom, and that piece stays there and then a new piece is generated
useEffect(() => {
  const interval = setInterval(() => {
    const newBoard = [...board];
    let newPosition = position + 4;
    
    if (newPosition > 35) {
      // if it hits the bottom, generate a new piece
      setPosition(Math.floor(Math.random() * 4));
      const randomNumber = Math.floor(Math.random()* initialNumbers.length);
      setPiece(initialNumbers[randomNumber]);
      setReset(!reset);
    } else if (newBoard[newPosition] !== 0 && piece === 'BOMB') {
      // this is a bomb and clears piece that it hits and the piece itself and generates a new piece
      newBoard[newPosition] = 0;
      newBoard[position] = 0;
      setPosition(Math.floor(Math.random() * 4));
      const randomNumber = Math.floor(Math.random()* numberArray.length);
      setPiece(numberArray[randomNumber]);
      setReset(!reset);
    } else if (newBoard[newPosition] !== 0 && piece === 'W') {
      // this is a wild card and doubles the piece that it hits and removes the piece itself and generates a new piece
      newBoard[newPosition] *= 2;
      newBoard[position] = 0;
      setPosition(Math.floor(Math.random() * 4));
      const randomNumber = Math.floor(Math.random()* numberArray.length);
      setPiece(numberArray[randomNumber]);
      setReset(!reset);
    }else if (newBoard[newPosition] === piece) {
      // if the piece hits another piece of the same number, it doubles the piece and moves down
      let currPiece = piece*2
      newBoard[newPosition] = piece * 2;
      newBoard[position] = 0;
      setPosition(newPosition);
      // check to see if the piece can move down again, if it can and the piece is equal to the current piece, it doubles again and keep checking to see if it can move down again
      while (newPosition + 4 <= 35 && newBoard[newPosition + 4] === currPiece) {
        newPosition += 4;
        newBoard[newPosition] = currPiece * 2;
        newBoard[newPosition - 4] = 0;
        currPiece *= 2;
      }

    } else if (newBoard[newPosition] !== 0) {
      // if the piece hits another piece, generate a new piece
      setPosition(Math.floor(Math.random() * 4));
      const randomNumber = Math.floor(Math.random()* numberArray.length);
      setPiece(numberArray[randomNumber]);
      setReset(!reset);
    } else {
      // if the piece hits nothing, it moves down
      newBoard[newPosition] = piece;
      newBoard[position] = 0;
      setPosition(newPosition);
    }
    setBoard(newBoard);
  }, 1000);
  return () => clearInterval(interval);
}, [position, piece, reset]);


// when left or right arrow key is pressed, the piece moves left or right
useEffect(() => {
  const handleKeyDown = (event) => {
    const newBoard = [...board];
    if (event.keyCode === 37) {
      if (position % 4 !== 0) {
        newBoard[position - 1] = piece;
        newBoard[position] = 0;
        setPosition(position - 1);
      }
    } else if (event.keyCode === 39) {
      if (position % 4 !== 3) {
        newBoard[position + 1] = piece;
        newBoard[position] = 0;
        setPosition(position + 1);
      }
    }
    // if keycode is 40, check that column and find the lowest piece that is not 0 and move the piece there, and check if the piece is equal to the piece and double it and keep checking
    else if (event.keyCode === 40) {
      let newPosition = position + 4;
      while (newPosition + 4 <= 35 && newBoard[newPosition + 4] === 0) {
        newPosition += 4;
      }
      if (newBoard[newPosition] === piece) {
        let currPiece = piece*2
        newBoard[newPosition] = piece * 2;
        newBoard[newPosition - 4] = 0;
        newPosition -= 4;
        while (newPosition + 4 <= 35 && newBoard[newPosition + 4] === currPiece) {
          newPosition += 4;
          newBoard[newPosition] = currPiece * 2;
          newBoard[newPosition - 4] = 0;
          currPiece *= 2;
        }
      } else if (newBoard[newPosition] !== 0) {
        newBoard[newPosition - 4] = piece;
        newBoard[position] = 0;
        setPosition(newPosition - 4);
      } else {
        newBoard[newPosition] = piece;
        newBoard[position] = 0;
        setPosition(newPosition);
      }
    }
    setBoard(newBoard);
  }
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [position, piece]);

// show the board
  const showBoard = board.map( (item, index) => {
    let classes = 'text-transparent';
    if (item === 2) classes = 'bg-gray-200';
    if (item === 4) classes = 'bg-yellow-100';
    if (item === 8) classes = 'bg-green-300';
    if (item === 16) classes = 'bg-blue-300';
    if (item === 32) classes = 'bg-indigo-200';
    if (item === 64) classes = 'bg-purple-400';
    if (item === 128) classes = 'bg-pink-200';
    if (item === 256) classes = 'bg-red-200';
    if (item === 512) classes = 'bg-yellow-300';
    if (item === 1024) classes = 'bg-green-400';
    if (item === 2048) classes = 'bg-blue-400';
    if (item === 'W') classes = 'bg-white';
    if (item === 'BOMB') classes = 'bg-black';
    return (<div key={index} className={`w-16 p-4 flex justify-center rounded text-lg ${classes}`}>{item}</div>)
  });

  return   (
      <div className='flex flex-col items-center justify-center m-4'>
        <div className='p-4'>
          <h1 className='text-4xl font-bold'>Stacky Game</h1>
          <h2 className='text-3xl font-bold'>Score:</h2>
        </div>
        <div className='rounded-xl grid gap-1 grid-cols-4 bg-blue-400 grid-rows-9 p-5'>
          {showBoard}
        </div>
        <div className='p-4'>
          <h2 className='text-3xl font-bold'>Instructions:</h2>
          <p className='text-lg'>Use the left and right arrow keys to move the piece left and right.</p>
          <p className='text-lg'>The piece will fall down until it hits the bottom or another piece.</p>
          <p className='text-lg'>If the piece hits another piece of the same number, the two pieces will combine and the number will double.</p>
          <p className='text-lg'>If the piece hits another piece of a different number, the piece will stop and a new piece will be generated.</p>
          <p className='text-lg'>If the piece hits a white piece, the piece will stop and a new piece will be generated.</p>
          <p className='text-lg'>If the piece hits a black piece, the game will end.</p>
        </div>
      </div>
    )
}

export default HomePage