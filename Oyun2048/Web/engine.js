'use strict';

// 2048 game logic. No browser dependency; it can be tested with Node.js.
class Engine2048 {
  constructor(random = Math.random) {
    this.random = random;
    this.best = 0;
    this.newGame();
  }

  static emptyBoard() {
    return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
  }

  static mergeLine(line) {
    const numbers = line.filter(value => value !== 0);
    const merged = [];
    let points = 0;
    for (let i = 0; i < numbers.length; i++) {
      if (i + 1 < numbers.length && numbers[i] === numbers[i + 1]) {
        const combined = numbers[i] * 2;
        merged.push(combined);
        points += combined;
        i++;
      } else {
        merged.push(numbers[i]);
      }
    }
    while (merged.length < 4) merged.push(0);
    return { line: merged, points };
  }

  newGame() {
    const savedBest = this.best || 0;
    this.board = Engine2048.emptyBoard();
    this.score = 0;
    this.best = savedBest;
    this.winAcknowledged = false;
    this.showWin = false;
    this.over = false;
    this.undoState = null;
    this.addRandomTile();
    this.addRandomTile();
  }

  get canUndo() { return this.undoState !== null; }

  addRandomTile() {
    const empty = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length === 0) return false;
    const [r, c] = empty[Math.floor(this.random() * empty.length)];
    this.board[r][c] = this.random() < 0.9 ? 2 : 4;
    return true;
  }

  hasMoves() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const n = this.board[r][c];
        if (n === 0) return true;
        if (r + 1 < 4 && n === this.board[r + 1][c]) return true;
        if (c + 1 < 4 && n === this.board[r][c + 1]) return true;
      }
    }
    return false;
  }

  move(direction) {
    if (!['left', 'right', 'up', 'down'].includes(direction)) return false;
    if (this.over || this.showWin) return false;
    const before = this.board.map(row => [...row]);
    const next = this.board.map(row => [...row]);
    let gained = 0;

    for (let i = 0; i < 4; i++) {
      const positions = [];
      for (let j = 0; j < 4; j++) {
        if (direction === 'left') positions.push([i, j]);
        if (direction === 'right') positions.push([i, 3 - j]);
        if (direction === 'up') positions.push([j, i]);
        if (direction === 'down') positions.push([3 - j, i]);
      }
      const line = positions.map(([r, c]) => before[r][c]);
      const result = Engine2048.mergeLine(line);
      gained += result.points;
      positions.forEach(([r, c], index) => { next[r][c] = result.line[index]; });
    }

    if (next.every((row, r) => row.every((value, c) => value === before[r][c]))) {
      return false;
    }

    this.undoState = {
      board: before,
      score: this.score,
      winAcknowledged: this.winAcknowledged,
      showWin: this.showWin,
      over: this.over
    };
    this.board = next;
    this.score += gained;
    this.best = Math.max(this.best, this.score);
    this.addRandomTile();
    if (!this.winAcknowledged && this.board.some(row => row.some(value => value >= 2048))) {
      this.showWin = true;
    }
    this.over = !this.hasMoves();
    return true;
  }

  continueAfterWin() {
    this.winAcknowledged = true;
    this.showWin = false;
  }

  undo() {
    if (!this.undoState) return false;
    const previous = this.undoState;
    this.board = previous.board.map(row => [...row]);
    this.score = previous.score;
    this.winAcknowledged = previous.winAcknowledged;
    this.showWin = previous.showWin;
    this.over = previous.over;
    this.undoState = null;
    return true;
  }

  serialize() {
    return JSON.stringify({
      board: this.board,
      score: this.score,
      best: this.best,
      winAcknowledged: this.winAcknowledged,
      showWin: this.showWin,
      over: this.over,
      undoState: this.undoState
    });
  }

  restore(json) {
    try {
      const state = typeof json === 'string' ? JSON.parse(json) : json;
      const isTile = v => Number.isSafeInteger(v) && (v === 0 || (v > 0 && Number.isInteger(Math.log2(v))));
      const validBoard = board => Array.isArray(board) && board.length === 4 &&
        board.every(row => Array.isArray(row) && row.length === 4 && row.every(isTile));
      if (!state || !validBoard(state.board)) return false;
      if (!Number.isSafeInteger(state.score) || state.score < 0) return false;
      if (!Number.isSafeInteger(state.best) || state.best < 0) return false;
      this.board = state.board.map(row => [...row]);
      this.score = state.score;
      this.best = Math.max(state.best, state.score);
      this.winAcknowledged = state.winAcknowledged === true;
      this.showWin = state.showWin === true;
      this.over = !this.hasMoves();
      const old = state.undoState;
      this.undoState = old && validBoard(old.board) && Number.isSafeInteger(old.score)
        ? { board: old.board.map(row => [...row]), score: old.score,
            winAcknowledged: old.winAcknowledged === true, showWin: old.showWin === true,
            over: old.over === true }
        : null;
      return true;
    } catch (_) {
      return false;
    }
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = Engine2048;
if (typeof window !== 'undefined') window.Engine2048 = Engine2048;
