let CLASS_LOOM;
let selectedSeat = null;

$(function () {
  loadConfig();
  loadClassTemplate();
  loadDescription();
  loadFrontPriorityNumbers();
  loadMode();
  loadMembers();
  restoreSeatMap();
  $('.loading').remove();
});

function getCurrentRoomCapacity() {
  if (!CLASS_LOOM || !CLASS_LOOM.seat) return 0;
  return CLASS_LOOM.seat.reduce(
    (sum, row) => sum + row.filter((cell) => cell === SEAT_TYPE.SEAT).length,
    0
  );
}

$('#paste-btn').on('click', function () {
  navigator.clipboard
    .readText()
    .then((text) => {
      const members = parseCSV(text);
      const capacity = getCurrentRoomCapacity();
      if (members.length > capacity) {
        alert(
          `名簿の人数(${members.length})が教室の席数(${capacity})を超えています。`
        );
      }
      saveLocalStorage('members', members);
    })
    .catch(() => {
      alert('Failed to read clipboard!');
    });
  $('#members').empty();
  deleteSeatMap();

  setTimeout(() => {
    loadMembers();
  }, 50);
});

$('#mode-btn').on('click', function () {
  if (CONFIG.mode === -1) {
    CONFIG.mode = MODES.PREVIEW;
  }

  switch (CONFIG.mode) {
    case MODES.PREVIEW: {
      $(this)
        .text(MODE_STYLES[MODES.SETTINGS].text)
        .removeClass(MODE_STYLES[MODES.PREVIEW].button)
        .addClass(MODE_STYLES[MODES.SETTINGS].button);

      $('.preview-wrapper').addClass('hidden');
      $('.settings-wrapper').removeClass('hidden');

      CONFIG.mode = MODES.SETTINGS;
      saveLocalStorage('mode', CONFIG.mode);
      break;
    }
    case MODES.SETTINGS: {
      $(this)
        .text(MODE_STYLES[MODES.PREVIEW].text)
        .removeClass(MODE_STYLES[MODES.SETTINGS].button)
        .addClass(MODE_STYLES[MODES.PREVIEW].button);

      $('.preview-wrapper').removeClass('hidden');
      $('.settings-wrapper').addClass('hidden');

      CONFIG.mode = MODES.PREVIEW;
      saveLocalStorage('mode', CONFIG.mode);
      break;
    }
  }
});

$('#room-select').on('change', function () {
  const room = $(this).val();

  if (!SEATS_TEMPLATE) return;

  CLASS_LOOM = SEATS_TEMPLATE[room];

  if (!CLASS_LOOM) return;

  const seat = CLASS_LOOM.seat;
  const capacity = seat.reduce(
    (sum, row) => sum + row.filter((cell) => cell === SEAT_TYPE.SEAT).length,
    0
  );

  if (CONFIG.members.length > capacity) {
    alert(
      `名簿の人数(${CONFIG.members.length})が教室の席数(${capacity})を超えています。`
    );
  }

  $('.room').text(room);
  $('.capacity').text(`定員${capacity}名`).addClass('text-center');

  saveLocalStorage('selectedRoom', room);

  const $seatMapFront = $('.front .seat-map');
  const $seatMapBack = $('.back .seat-map');
  const $settingsSeatMap = $('.settings-wrapper .seat-map-container');

  if (CLASS_LOOM) {
    $seatMapFront.empty();
    $seatMapBack.empty();
    $settingsSeatMap.empty();

    const reversedSeat = CLASS_LOOM.seat
      .slice()
      .reverse()
      .map((row) => row.slice().reverse());

    createSeats($seatMapFront, CLASS_LOOM.seat, true);
    createSeats($seatMapBack, reversedSeat, false);
    createSeats($settingsSeatMap, reversedSeat, false);
  }
});

$('.front .desc input.sub').on('input', function () {
  $('.back .desc .sub').text($(this).val());
  saveLocalStorage('description.sub', $(this).val());
});

$('.front .desc input.main').on('input', function () {
  $('.back .desc .main').text($(this).val());
  saveLocalStorage('description.main', $(this).val());
});

$('#add-btn').on('click', function () {
  const lastMember = CONFIG.members[CONFIG.members.length - 1];
  const newMember = {
    class: lastMember ? lastMember.class : '',
    number: lastMember ? String(Number(lastMember.number) + 1) : '1',
    name: '',
    furigana: '',
  };
  CONFIG.members.push(newMember);
  addMemberRow(newMember);
  saveLocalStorage('members', CONFIG.members);
});

$('#append-btn').on('click', function () {
  navigator.clipboard
    .readText()
    .then((text) => {
      const newMembers = parseCSV(text);
      const total = CONFIG.members.length + newMembers.length;
      const capacity = getCurrentRoomCapacity();
      if (total > capacity) {
        alert(`名簿の人数(${total})が教室の席数(${capacity})を超えています。`);
      }
      CONFIG.members = CONFIG.members.concat(newMembers);
      saveLocalStorage('members', CONFIG.members);
      newMembers.forEach(addMemberRow);
    })
    .catch(() => {
      alert('Failed to read clipboard!');
    });
});

$('#delete-all-btn').on('click', function () {
  if (window.confirm('すべて削除しますか？')) {
    CONFIG.members = [];
    saveLocalStorage('members', CONFIG.members);
    $('#members').empty();
    deleteSeatMap();
  }
});

$('#shuffle-btn').on('click', function () {
  if (CONFIG.members.length === 0) {
    alert('名簿が空です。');
    return;
  }
  const total = CONFIG.members.length;
  const capacity = getCurrentRoomCapacity();

  if (total > capacity) {
    alert(
      `名簿の人数(${CONFIG.members.length})が教室の席数(${capacity})を超えています。`
    );
    return;
  }

  deleteSeatMap();
  shuffleMembers();
});

$('#front-priority-numbers').on('input', function () {
  saveLocalStorage('frontPriorityNumbers', $(this).val());
});

function getSeatPositionFromElement($element) {
  const classList = $element.attr('class').split(' ');
  const posClass = classList.find((cls) => cls.startsWith('pos-'));
  if (posClass) {
    const parts = posClass.split('-');
    return { x: parseInt(parts[1]), y: parseInt(parts[2]) };
  }
  return null;
}

$(document).on('click', '.front .student-info', function (e) {
  e.stopPropagation();
  const $this = $(this);

  if ($this.hasClass('selected-seat')) {
    $this.removeClass('border-red-500 border-4 selected-seat');
    selectedSeat = null;
    return;
  }

  if (!selectedSeat) {
    $('.student-info').removeClass('border-red-500 border-4 selected-seat');
    $this.addClass('border-red-500 border-4 selected-seat');
    selectedSeat = $this;
    return;
  }

  if (selectedSeat && !$this.is(selectedSeat)) {
    const pos1 = getSeatPositionFromElement(selectedSeat);
    const pos2 = getSeatPositionFromElement($this);

    if (pos1 && pos2) {
      swapStudents(selectedSeat, $this, pos1, pos2, CONFIG.seatMap, CLASS_LOOM);
    }

    $('.student-info').removeClass('border-red-500 border-4 selected-seat');
    selectedSeat = null;
  }
});

$(document).on('click', function () {
  $('.student-info').removeClass('border-red-500 border-4 selected-seat');
  selectedSeat = null;
});

// TODO: Implement auto button function
$('#auto').on('click', function () {});
