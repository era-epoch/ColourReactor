import { BoardObject, SquareState } from '../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UpdateMap, VPong } from '../BoardObjects/VPong';

export interface BoardState {
  squares: SquareState[][];
  objects: BoardObject[];
  cursorColour: string;
  pixelBoardHeight: number;
  pixelBoardWidth: number;
  pixelSquareSize: number;
  timeDelta: number; // # of miliseconds between updates
}

const numSquaresInColumn = 32;
const width = window.innerWidth;
const height = window.innerHeight;
const squareSizePixels = Math.floor(height / numSquaresInColumn);
const numSquaresInRow = Math.floor(width / squareSizePixels);
const squares: SquareState[][] = [];
for (let i = 0; i < numSquaresInColumn; i++) {
  squares.push([]);
  for (let j = 0; j < numSquaresInRow; j++) {
    squares[i].push({ content: [], y: i, x: j } as SquareState);
  }
}

// const defaultCursorColour = new Color('rebeccapurple');

const initialBoardstate: BoardState = {
  squares: squares,
  objects: [],
  cursorColour: 'rebeccapurple',
  pixelBoardHeight: height,
  pixelBoardWidth: width,
  pixelSquareSize: squareSizePixels,
  timeDelta: 50,
};

const boardSlice = createSlice({
  name: 'board',
  initialState: initialBoardstate,
  reducers: {
    update: (state: BoardState) => {
      console.log('Updating');
      for (const object of state.objects) {
        const updateF = UpdateMap.get(object.tag);
        if (updateF) updateF(object, state);
      }
    },
    spawnVPong: (state: BoardState, action: PayloadAction<{ vpong: VPong }>) => {
      console.log('Spawning VPong');
      state.objects.push(action.payload.vpong);
    },
  },
});

export default boardSlice.reducer;
export const { update, spawnVPong } = boardSlice.actions;
