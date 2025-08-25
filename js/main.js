let CLASS_LOOM;
let selectedSeat = null;

$(function () {
  loadConfig();
  loadClassTemplate();
  loadDescription();
  loadFrontPriorityNumbers();
  loadMode();
  loadMembers();
  loadClassGroupToggle();
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
  const prevRoom = getLocalStorage('selectedRoom');
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
    $(this).val(prevRoom);
    return;
  }

  if (prevRoom && prevRoom !== room) {
    localStorage.removeItem('seatMap');
    CONFIG.seatMap = [];
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

    restoreSeatMap();
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

$('#class-group-toggle').on('change', function () {
  CONFIG.classGrouping = $(this).prop('checked');
  saveLocalStorage('classGrouping', CONFIG.classGrouping);
});

function loadClassGroupToggle() {
  const classGrouping = getLocalStorage('classGrouping');
  if (classGrouping !== '' && classGrouping !== undefined) {
    CONFIG.classGrouping = classGrouping;
    $('#class-group-toggle').prop('checked', classGrouping);
  }
}

function exportConfigs() {
  try {
    const userPrefix = prompt('ファイル名のプレフィックスを入力してください:');

    // 現在の日時を取得してファイル名を作成
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    let filename;
    if (userPrefix && userPrefix.trim() !== '') {
      // 文字列が入力された場合: "文字列-yyyymmdd-hhmmss.json"
      const sanitizedPrefix = userPrefix.trim().replace(/[<>:"/\\|?*]/g, '_'); // 無効な文字を置換
      filename = `${sanitizedPrefix}-${year}${month}${day}-${hours}${minutes}${seconds}.json`;
    } else {
      // 空欄の場合: "yyyymmdd-hhmmss.json"
      filename = `${year}${month}${day}-${hours}${minutes}${seconds}.json`;
    }

    const configData = localStorage.getItem('kajiwa.sekigae.config');
    let exportData = {};

    if (configData) {
      try {
        exportData = JSON.parse(configData);
      } catch (parseError) {
        console.error('Config parse error:', parseError);
        exportData = { error: 'Failed to parse config data' };
      }
    } else {
      exportData = { error: 'No config data found' };
    }

    // JSONとして整形
    const jsonString = JSON.stringify(exportData);

    // Blobを作成してダウンロード
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // ダウンロードリンクを作成
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // URLオブジェクトをクリーンアップ
    URL.revokeObjectURL(url);

    console.log(`LocalStorage exported as ${filename}`);
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}

// JSONファイルからconfigをインポートする関数
function importConfigs() {
  return new Promise((resolve, reject) => {
    try {
      // ファイル選択用のinput要素を作成
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.onchange = function (event) {
        const file = event.target.files[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        // ファイルを読み込む
        const reader = new FileReader();
        reader.onload = function (e) {
          try {
            const jsonData = JSON.parse(e.target.result);

            // CONFIGの有効なキーを動的に取得
            const validConfigKeys = Object.keys(CONFIG);

            // JSONに無効なキーが含まれていないかチェック
            const jsonKeys = Object.keys(jsonData);
            const invalidKeys = jsonKeys.filter(
              (key) => !validConfigKeys.includes(key)
            );

            if (invalidKeys.length > 0) {
              alert(
                `無効なキーが含まれています: ${invalidKeys.join(
                  ', '
                )}\nインポートを中止します。`
              );
              reject(
                new Error(`Invalid keys found: ${invalidKeys.join(', ')}`)
              );
              return;
            }

            // CONFIGオブジェクトを更新
            Object.keys(jsonData).forEach((key) => {
              CONFIG[key] = jsonData[key];
            });

            // localStorageに保存
            localStorage.setItem(
              'kajiwa.sekigae.config',
              JSON.stringify(CONFIG)
            );

            console.log('Config imported successfully:', CONFIG);

            // UIを更新
            updateUIAfterImport();

            resolve(CONFIG);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            reject(new Error('Invalid JSON file'));
          }
        };

        reader.onerror = function () {
          reject(new Error('File read error'));
        };

        reader.readAsText(file);
      };

      // ファイル選択ダイアログを開く
      input.click();
    } catch (error) {
      console.error('Import failed:', error);
      reject(error);
    }
  });
}

// インポート後にUIを更新する関数
function updateUIAfterImport() {
  try {
    // メンバーリストを更新
    $('#members').empty();
    if (CONFIG.members && Array.isArray(CONFIG.members)) {
      CONFIG.members.forEach((member) => {
        addMemberRow(member);
      });
    }

    // トグル状態を更新
    if (CONFIG.classGrouping !== undefined) {
      $('#class-group-toggle').prop('checked', CONFIG.classGrouping);
    }

    // 教室選択を更新
    if (CONFIG.selectedRoom) {
      $('#room-select').val(CONFIG.selectedRoom);
      $('#room-select').trigger('change');
    }

    // 前方希望者番号を更新
    if (CONFIG.frontPriorityNumbers) {
      $('#front-priority-numbers').val(CONFIG.frontPriorityNumbers);
    }

    // 説明文を更新
    if (CONFIG.description) {
      if (CONFIG.description.main) {
        $('.front .desc input.main').val(CONFIG.description.main);
        $('.back .desc .main').text(CONFIG.description.main);
      }
      if (CONFIG.description.sub) {
        $('.front .desc input.sub').val(CONFIG.description.sub);
        $('.back .desc .sub').text(CONFIG.description.sub);
      }
    }

    alert('設定のインポートが完了しました。');
  } catch (error) {
    console.error('UI update failed:', error);
    alert(
      '設定は読み込まれましたが、UIの更新に失敗しました。ページを再読み込みしてください。'
    );
  }
}

// TODO: Implement auto button function
$('#auto').on('click', function () {});
