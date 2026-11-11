'use strict';
const assert = require('node:assert/strict');
const Game = require('../Oyun2048/Web/engine.js');

function verifySlide(source, expected, points) {
  const got = Game.mergeLine(source);
  assert.deepEqual(got.line, expected);
  assert.equal(got.points, points);
}
verifySlide([2, 2, 2, 2], [4, 4, 0, 0], 8);
verifySlide([2, 0, 2, 4], [4, 4, 0, 0], 4);
verifySlide([2, 2, 4, 4], [4, 8, 0, 0], 12);
verifySlide([4, 4, 8, 8], [8, 16, 0, 0], 24);
verifySlide([0, 0, 0, 0], [0, 0, 0, 0], 0);
verifySlide([4, 0, 4, 4], [8, 4, 0, 0], 8);
verifySlide([2, 2, 2, 0], [4, 2, 0, 0], 4);

const g = new Game(() => 0);
assert.equal(g.board.flat().filter(Boolean).length, 2, '2 starting tiles');
assert.equal(g.score, 0);
assert.equal(g.canUndo, false);

g.board = [[2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
assert.equal(g.move('left'), true);
assert.equal(g.score, 4);
assert.equal(g.board[0][0], 4);
assert.equal(g.board.flat().filter(Boolean).length, 2, 'one new tile spawned');
assert.equal(g.canUndo, true);
assert.equal(g.undo(), true);
assert.deepEqual(g.board[0], [2, 2, 0, 0]);
assert.equal(g.score, 0);
assert.equal(g.canUndo, false);

const save = g.serialize();
const h = new Game(() => 0);
assert.equal(h.restore(save), true);
assert.deepEqual(h.board, g.board);
assert.equal(h.restore('not json'), false);

// A board with no empty squares and no adjacent equal tiles is a loss.
g.board = [[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2]];
assert.equal(g.hasMoves(), false);
assert.equal(g.move('left'), false, 'invalid move must not spawn a tile');
assert.equal(g.board.flat().filter(Boolean).length, 16);

// 2048 achievement can be acknowledged to keep playing.
g.board = [[1024, 1024, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
g.over = false;
g.showWin = false;
g.winAcknowledged = false;
assert.equal(g.move('left'), true);
assert.equal(g.showWin, true);
assert.equal(g.score, 2048);
assert.equal(g.move('right'), false, 'game paused at win prompt');
g.continueAfterWin();
assert.equal(g.showWin, false);
assert.equal(g.winAcknowledged, true);
assert.equal(g.move('right'), true);

console.log('2048 game engine tests passed');
