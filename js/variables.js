const MODES = Object.freeze({
  PREVIEW: 0,
  SETTINGS: 1,
});

const MODE_STYLES = Object.freeze({
  [MODES.PREVIEW]: {
    button:
      'text-black font-bold bg-green-500 hover:bg-green-600 py-2 px-4 rounded',
    text: 'プレビューモード',
  },
  [MODES.SETTINGS]: {
    button:
      'text-black font-bold bg-blue-400 hover:bg-blue-500 py-2 px-4 rounded',
    text: '設定モード',
  },
});

const STUDENT_INFO_STYLE = Object.freeze({
  height: 70,
  width: 120,
});

const SEAT_TYPE = Object.freeze({
  SEAT: 1,
  AISLE: -1,
  EMPTY: 0,
});

const SEAT_PRIORITY = Object.freeze([
  // back
  [2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
  [3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 4, 3],
  [3, 5, 6, 7, 7, 7, 7, 7, 7, 6, 5, 3],
  [3, 5, 7, 8, 9, 9, 9, 9, 8, 7, 5, 3],
  [3, 5, 7, 9, 10, 10, 10, 10, 9, 7, 5, 3],
  [3, 5, 7, 9, 10, 10, 10, 10, 9, 7, 5, 3],
  [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
  // front
]);

const SEATS_TEMPLATE = Object.freeze({
  // 35th floor
  353: {
    seat: [
      [0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 0, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 0, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
    ],
  },

  // 34th floor
  341: {
    seat: [
      [0, 0, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
    ],
  },
  342: {
    seat: [
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 0, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
    ],
  },
  345: {
    seat: [
      [0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0, 0],
    ],
  },

  // 33th floor
  331: {
    seat: [
      [0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
    ],
  },
  332: {
    seat: [
      [0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
    ],
  },
  334: {
    seat: [
      [0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [0, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0],
    ],
  },
  335: {
    seat: [
      [0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
    ],
  },

  // 29th floor
  294: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  295: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  296: {
    seat: [
      [0, 0, -1, 0, , 0, 0, -1, 0, 0, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
    ],
  },

  // 28th floor
  281: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  282: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  283: {
    seat: [
      [0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
    ],
  },
  284: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },

  // 24th floor
  241: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  242: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  243: {
    seat: [
      [0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
    ],
  },
  244: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  245: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  246: {
    seat: [
      [0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
    ],
  },
  247: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  248: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  249: {
    seat: [
      [0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
    ],
  },

  // 20th floor
  201: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  202: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  203: {
    seat: [
      [0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0],
      [0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
    ],
  },
  204: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  205: {
    seat: [
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0],
      [0, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
      [1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1],
    ],
  },
  206: {
    seat: [
      [0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0],
      [0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
      [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1],
    ],
  },

  // 19th floor
  191: {
    seat: [
      [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
      [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
      [0, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
    ],
  },
  192: {
    seat: [
      [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
      [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
    ],
  },
  193: {
    seat: [
      [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
      [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 0, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
    ],
  },
  197: {
    seat: [
      [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
      [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
      [0, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
    ],
  },
  198: {
    seat: [
      [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
      [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
    ],
  },
  199: {
    seat: [
      [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
      [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 0, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
      [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0],
    ],
  },
});
