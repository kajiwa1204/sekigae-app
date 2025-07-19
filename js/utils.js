let CONFIG = {
  selectedRoom: '',
  frontPriorityNumbers: '',
  description: {
    main: '',
    sub: '',
  },
  mode: -1,
  members: [],
  seatMap: [],
};

function saveLocalStorage(key, value) {
  const keys = key.split('.');
  let obj = CONFIG;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in obj)) obj[keys[i]] = {};
    obj = obj[keys[i]];
  }
  obj[keys[keys.length - 1]] = value;

  if (key === 'members' || key.endsWith('.members')) {
    value = [...value].sort((a, b) => {
      const aid = `${a.class}-${a.number}`;
      const bid = `${b.class}-${b.number}`;
      return aid.localeCompare(bid, 'ja', { numeric: true });
    });
    obj[keys[keys.length - 1]] = value;
  }
  localStorage.setItem('kajiwa.sekigae.config', JSON.stringify(CONFIG));
}

function getLocalStorage(key) {
  const keys = key.split('.');
  let obj = CONFIG;
  for (let i = 0; i < keys.length; i++) {
    if (obj && typeof obj === 'object' && keys[i] in obj) {
      obj = obj[keys[i]];
    } else {
      return '';
    }
  }
  return obj;
}

function loadConfig() {
  const configPath = localStorage.getItem('kajiwa.sekigae.config');
  if (configPath) {
    try {
      const obj = JSON.parse(configPath);
      if (obj && typeof obj === 'object') {
        CONFIG = obj;
      }
    } catch (ignored) {}
  }
}

function loadClassTemplate() {
  if (SEATS_TEMPLATE) {
    const $select = $('#room-select');
    Object.keys(SEATS_TEMPLATE)
      .sort((a, b) => Number(b) - Number(a))
      .forEach(function (room) {
        $select.append(
          $('<option>')
            .val(room)
            .text(room)
            .addClass('bg-white text-black text-2xl')
        );
      });
    const savedRoom = getLocalStorage('selectedRoom');
    if (savedRoom && SEATS_TEMPLATE[savedRoom]) {
      $select.val(savedRoom);
    } else {
      $select.find('option:first').prop('selected', true);
    }
    $select.trigger('change');
  }
}

function loadDescription() {
  const $descSub = $('.front .desc .sub');
  const $descMain = $('.front .desc .main');
  const sub = getLocalStorage('description.sub');
  const main = getLocalStorage('description.main');
  if (sub && sub.length > 0) {
    $descSub.val(sub);
    $('.back .desc .sub').text(sub);
  }
  if (main && main.length > 0) {
    $descMain.val(main);
    $('.back .desc .main').text(main);
  }
}

function loadFrontPriorityNumbers() {
  const value = getLocalStorage('frontPriorityNumbers');
  if (value) {
    $('#front-priority-numbers').val(value);
  }
}

function loadMode() {
  switch (CONFIG.mode) {
    case MODES.SETTINGS:
      $('.preview-wrapper').addClass('hidden');
      $('.settings-wrapper').removeClass('hidden');
      $('#mode-btn')
        .text(MODE_STYLES[MODES.SETTINGS].text)
        .removeClass(MODE_STYLES[MODES.PREVIEW].button)
        .addClass(MODE_STYLES[MODES.SETTINGS].button);
      break;
    default:
      $('.preview-wrapper').removeClass('hidden');
      $('.settings-wrapper').addClass('hidden');
      $('#mode-btn')
        .text(MODE_STYLES[MODES.PREVIEW].text)
        .removeClass(MODE_STYLES[MODES.SETTINGS].button)
        .addClass(MODE_STYLES[MODES.PREVIEW].button);
      CONFIG.mode = MODES.PREVIEW;
      break;
  }
}

function handleMemberChange($element, property) {
  const $this = $element;
  const $parent = $this.parent();
  const id = $parent.data('id');
  const index = CONFIG.members.findIndex((m) => m.class + m.number === id);
  if (index !== -1) {
    CONFIG.members[index][property] = $this.val();
    if (property === 'class' || property === 'number') {
      $parent.data(
        'id',
        CONFIG.members[index].class + CONFIG.members[index].number
      );
    }
    saveLocalStorage('members', CONFIG.members);
  }
}

function createMemberInput(property, width, m, marginRight = 'mr-2') {
  return $('<input>')
    .addClass(`${property} p-2 rounded ${width} text-2xl ${marginRight}`)
    .val(m[property])
    .on('input', function () {
      handleMemberChange($(this), property);
    });
}

function addMemberRow(m) {
  $('#members').append(
    $('<div>')
      .addClass('member p-2 w-full mb-2 border border-gray-500 rounded')
      .data('id', m.class + m.number)
      .append(
        createMemberInput('class', 'w-36', m),
        createMemberInput('number', 'w-24', m),
        createMemberInput('name', 'w-96', m),
        createMemberInput('furigana', 'w-96', m, 'mr-8'),
        $('<button>')
          .addClass(
            'del p-2 text-white bg-red-500 hover:bg-red-600 rounded text-2xl'
          )
          .text('削除')
          .on('click', function () {
            $(this).parent().remove();
            CONFIG.members = CONFIG.members.filter(
              (member) => member.class + member.number !== m.class + m.number
            );
            saveLocalStorage('members', CONFIG.members);
          })
      )
  );
}

function loadMembers() {
  $('#members').empty();
  CONFIG.members.forEach(addMemberRow);
}

function createSeats($container, seatRows, front) {
  const aisleWidth = STUDENT_INFO_STYLE.width / 6;
  const spaceWidth = STUDENT_INFO_STYLE.width / 64;
  const spaceHeight = STUDENT_INFO_STYLE.width / 8;
  const rowsLength = seatRows.length;

  let currentY = 0;

  seatRows.forEach((row, y) => {
    const rowDiv = $('<div>')
      .addClass('flex')
      .css({ marginBottom: `${spaceHeight}px` });

    const rowLength = row.length;
    row.forEach((cell, x) => {
      const posX = front ? x : rowLength - x - 1;
      const posY = front ? y : rowsLength - y - 1;

      switch (cell) {
        case SEAT_TYPE.SEAT: {
          const studentInfo = $('<div>')
            .addClass(
              `student-info pos-${posX}-${posY} border border-black rounded-md bg-white`
            )
            .css('width', `${STUDENT_INFO_STYLE.width}px`)
            .css('height', `${STUDENT_INFO_STYLE.height}px`);
          const idDiv = $('<div>').addClass(
            `id overflow-hidden rounded-t-md text-center flex items-center justify-center leading-normal${
              front ? ' bg-yellow-100' : ''
            }`
          );
          const furiganaDiv = $('<div>').addClass(
            'furigana overflow-hidden text-center flex items-center justify-center leading-normal'
          );
          const nameDiv = $('<div>').addClass(
            'name overflow-hidden text-center flex items-center justify-center leading-normal'
          );
          studentInfo.append(idDiv, furiganaDiv, nameDiv);
          studentInfo.css('margin-right', `${spaceWidth}px`);
          rowDiv.append(studentInfo);
          break;
        }
        case SEAT_TYPE.AISLE: {
          const aisleDiv = $('<div>')
            .addClass('aisle')
            .css('width', `${aisleWidth}px`);
          rowDiv.append(aisleDiv);
          break;
        }
        case SEAT_TYPE.EMPTY: {
          const emptyDiv = $('<div>')
            .addClass('empty-space')
            .css('height', `${STUDENT_INFO_STYLE.height}px`)
            .css('width', `${STUDENT_INFO_STYLE.width}px`)
            .css('margin-right', `${spaceWidth}px`);
          rowDiv.append(emptyDiv);
          break;
        }
      }
    });

    rowDiv.children().last().css({ marginRight: '0', marginBottom: '0' });
    $container.append(rowDiv);
  });
}

function fitTextToBox($el, maxFontSize = 32, minFontSize = 8, step = 1) {
  // Excel の｢縮小して全体を表示する｣を再現
  const element = $el[0];
  if (!element) {
    console.warn('fitTextToBox: Element not found', $el);
    return;
  }

  const computedStyle = window.getComputedStyle(element);
  const boxWidth = parseFloat(computedStyle.width);
  const boxHeight = parseFloat(computedStyle.height);
  const tolerance = 0.5;

  if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight <= 0) {
    $el.css('font-size', minFontSize + 'px');
    return;
  }

  let fontSize = maxFontSize;
  $el.css('font-size', fontSize + 'px');

  while (fontSize > minFontSize) {
    const currentScrollWidth = element.scrollWidth;
    const currentScrollHeight = element.scrollHeight;

    if (
      currentScrollWidth <= boxWidth + tolerance &&
      currentScrollHeight <= boxHeight + tolerance
    ) {
      $el.css('font-size', fontSize + 'px');
      return;
    }
    fontSize -= step;
    $el.css('font-size', fontSize + 'px');
  }

  $el.css('font-size', minFontSize + 'px');
}

function parseCSV(data) {
  // excelからの直接貼り付けの場合tab separated valueなのでcsvに変換
  data = data.replaceAll('\t', ',');

  const rows = data.split('\n').filter((row) => row.length > 0);

  return rows.map((row) => {
    const [className, num, name, furigana] = row
      .split(',')
      .map((item) => item.trim());
    return {
      class: className,
      number: num,
      name: name,
      furigana: furigana,
    };
  });
}

function getOptimalSeats(memberCount) {
  if (!CLASS_LOOM || !CLASS_LOOM.seat) return [];

  const seats = [];
  for (let y = 0; y < CLASS_LOOM.seat.length; y++) {
    for (let x = 0; x < CLASS_LOOM.seat[y].length; x++) {
      if (CLASS_LOOM.seat[y][x] === SEAT_TYPE.SEAT) {
        seats.push({
          x,
          y,
          priority: SEAT_PRIORITY[y][x],
        });
      }
    }
  }
  seats.sort((a, b) => b.priority - a.priority);

  const selected = seats.slice(0, memberCount);

  // yが大きい順，xが小さい順でソート(右前を基準に左後ろへ)
  selected.sort((a, b) => {
    if (a.y !== b.y) return b.y - a.y;
    return a.x - b.x;
  });

  return selected
    .map((seat) => ({
      x: seat.x,
      y: seat.y,
      priority: seat.priority,
    }))
    .sort((a, b) => b.priority - a.priority);
}

function restoreSeatMap() {
  if (
    !CONFIG.seatMap ||
    !Array.isArray(CONFIG.seatMap) ||
    CONFIG.seatMap.length === 0
  ) {
    return;
  }
  let restoredCount = 0;
  CONFIG.seatMap.forEach((seat) => {
    const wrapper = $(`.student-info.pos-${seat.x}-${seat.y}`);
    if (wrapper.length === 0) return;
    const idDiv = wrapper.find('.id');
    const furiganaDiv = wrapper.find('.furigana');
    const nameDiv = wrapper.find('.name');
    idDiv.text(`${seat.class}-${seat.number}`);
    furiganaDiv.text(`${seat.furigana}`);
    nameDiv.text(`${seat.name}`);
    fitTextToBox(idDiv);
    fitTextToBox(furiganaDiv);
    fitTextToBox(nameDiv);
    restoredCount++;
  });
  if (restoredCount === 0) {
    alert(
      '席割り当ての復元に失敗しました。教室や座席レイアウトが変更されている可能性があります。'
    );
  }
}

function assignMembersToSeats(
  members,
  seats,
  seatOffset = 0,
  isPriority = false
) {
  members
    .sort(() => Math.random() - 0.5)
    .forEach((m, i) => {
      const seat = seats[i + seatOffset];
      if (seat) {
        const wrapper = $(`.student-info.pos-${seat.x}-${seat.y}`);
        wrapper.removeClass('priority');
        if (isPriority) {
          wrapper.addClass('priority');
        }
        const idDiv = wrapper.find('.id');
        const furiganaDiv = wrapper.find('.furigana');
        const nameDiv = wrapper.find('.name');

        idDiv.text(`${m.class}-${m.number}`);
        furiganaDiv.text(`${m.furigana}`);
        nameDiv.text(`${m.name}`);

        fitTextToBox(idDiv);
        fitTextToBox(furiganaDiv);
        fitTextToBox(nameDiv);

        CONFIG.seatMap.push({
          x: seat.x,
          y: seat.y,
          class: m.class,
          number: m.number,
          name: m.name,
          furigana: m.furigana,
        });
      }
    });
}

function shuffleMembers() {
  const len = CONFIG.members.length;
  if (len === 0) return;

  const optimalSeats = getOptimalSeats(len);

  const priorityInput = $('#front-priority-numbers').val();
  const lowerCasePriorityInput = priorityInput.toLowerCase();

  const priorityStudentIdentifiers = Array.from(
    new Set(
      lowerCasePriorityInput
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item && item.includes('-'))
    )
  );

  const priorityMembers = CONFIG.members.filter((member) => {
    const memberIdentifier = `${member.class}-${member.number}`.toLowerCase();
    return priorityStudentIdentifiers.includes(memberIdentifier);
  });
  const nonPriorityMembers = CONFIG.members.filter((member) => {
    const memberIdentifier = `${member.class}-${member.number}`.toLowerCase();
    return !priorityStudentIdentifiers.includes(memberIdentifier);
  });

  CONFIG.seatMap = [];

  assignMembersToSeats(priorityMembers, optimalSeats, 0, true);
  assignMembersToSeats(
    nonPriorityMembers,
    optimalSeats,
    priorityMembers.length,
    false
  );

  saveLocalStorage('seatMap', CONFIG.seatMap);
}

function deleteSeatMap() {
  CONFIG.seatMap = [];
  saveLocalStorage('seatMap', CONFIG.seatMap);
  $('.student-info .id').text('');
  $('.student-info .furigana').text('');
  $('.student-info .name').text('');
}

function swapStudents(
  $seatElement1,
  $seatElement2,
  pos1,
  pos2,
  seatMap,
  classLoom
) {
  const seatMapEntry1 = seatMap.find((s) => s.x === pos1.x && s.y === pos1.y);
  const seatMapEntry2 = seatMap.find((s) => s.x === pos2.x && s.y === pos2.y);

  const studentInfo1 = seatMapEntry1
    ? {
        class: seatMapEntry1.class,
        number: seatMapEntry1.number,
        name: seatMapEntry1.name,
        furigana: seatMapEntry1.furigana,
      }
    : { class: '', number: '', name: '', furigana: '' };
  const studentInfo2 = seatMapEntry2
    ? {
        class: seatMapEntry2.class,
        number: seatMapEntry2.number,
        name: seatMapEntry2.name,
        furigana: seatMapEntry2.furigana,
      }
    : { class: '', number: '', name: '', furigana: '' };

  $seatElement1
    .find('.id')
    .text(
      studentInfo2.class && studentInfo2.number
        ? `${studentInfo2.class}-${studentInfo2.number}`
        : ''
    );
  $seatElement1.find('.furigana').text(studentInfo2.furigana);
  $seatElement1.find('.name').text(studentInfo2.name);

  $seatElement2
    .find('.id')
    .text(
      studentInfo1.class && studentInfo1.number
        ? `${studentInfo1.class}-${studentInfo1.number}`
        : ''
    );
  $seatElement2.find('.furigana').text(studentInfo1.furigana);
  $seatElement2.find('.name').text(studentInfo1.name);

  if (
    classLoom &&
    classLoom.seat &&
    classLoom.seat.length > 0 &&
    classLoom.seat[0] &&
    classLoom.seat[0].length > 0
  ) {
    const $backSeat1 = $(`.back .student-info.pos-${pos1.x}-${pos1.y}`);
    const $backSeat2 = $(`.back .student-info.pos-${pos2.x}-${pos2.y}`);

    if ($backSeat1.length) {
      $backSeat1
        .find('.id')
        .text(
          studentInfo2.class && studentInfo2.number
            ? `${studentInfo2.class}-${studentInfo2.number}`
            : ''
        );
      $backSeat1.find('.furigana').text(studentInfo2.furigana);
      $backSeat1.find('.name').text(studentInfo2.name);
      fitTextToBox($backSeat1.find('.id'));
      fitTextToBox($backSeat1.find('.furigana'));
      fitTextToBox($backSeat1.find('.name'));
    }

    if ($backSeat2.length) {
      $backSeat2
        .find('.id')
        .text(
          studentInfo1.class && studentInfo1.number
            ? `${studentInfo1.class}-${studentInfo1.number}`
            : ''
        );
      $backSeat2.find('.furigana').text(studentInfo1.furigana);
      $backSeat2.find('.name').text(studentInfo1.name);
      fitTextToBox($backSeat2.find('.id'));
      fitTextToBox($backSeat2.find('.furigana'));
      fitTextToBox($backSeat2.find('.name'));
    }
  }

  if (seatMapEntry1 && seatMapEntry2) {
    [seatMapEntry1.class, seatMapEntry2.class] = [
      seatMapEntry2.class,
      seatMapEntry1.class,
    ];
    [seatMapEntry1.number, seatMapEntry2.number] = [
      seatMapEntry2.number,
      seatMapEntry1.number,
    ];
    [seatMapEntry1.name, seatMapEntry2.name] = [
      seatMapEntry2.name,
      seatMapEntry1.name,
    ];
    [seatMapEntry1.furigana, seatMapEntry2.furigana] = [
      seatMapEntry2.furigana,
      seatMapEntry1.furigana,
    ];
  } else if (seatMapEntry1 && !seatMapEntry2) {
    const index1 = seatMap.indexOf(seatMapEntry1);
    if (index1 > -1) seatMap.splice(index1, 1);
    if (studentInfo1.name)
      seatMap.push({ x: pos2.x, y: pos2.y, ...studentInfo1 });
  } else if (!seatMapEntry1 && seatMapEntry2) {
    const index2 = seatMap.indexOf(seatMapEntry2);
    if (index2 > -1) seatMap.splice(index2, 1);
    if (studentInfo2.name)
      seatMap.push({ x: pos1.x, y: pos1.y, ...studentInfo2 });
  }

  saveLocalStorage('seatMap', seatMap);

  fitTextToBox($seatElement1.find('.id'));
  fitTextToBox($seatElement1.find('.furigana'));
  fitTextToBox($seatElement1.find('.name'));
  fitTextToBox($seatElement2.find('.id'));
  fitTextToBox($seatElement2.find('.furigana'));
  fitTextToBox($seatElement2.find('.name'));
}
