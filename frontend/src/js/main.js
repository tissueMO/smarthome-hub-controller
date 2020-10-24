// ###################################################################
//    JS エントリーポイント
// ###################################################################
import $ from 'jquery';
import 'bootstrap4-notify';
import 'popper.js';
import 'bootstrap';
import '@coreui/coreui';

const Settings = require('./settings.js');

let progressBarTimer = null;
let partyTimer = null;
let partyStartedTime = null;
let partyLatestNumber = -1;

$(() => {
  // タブを切り替えたとき
  $('.nav .nav-link').on('show.bs.tab', e => {
    // パンくずリストを更新
    const $selectedTab = $(e.currentTarget);
    const caption = $selectedTab.text().trim();
    $('.breadcrumb .breadcrumb-item').text(caption);

    // 選択したタブの情報を永続化
    localStorage.setItem('tab', $selectedTab.attr('id'));
  });

  // ボタン押下時
  $('.js-remote-button').on('click', e => {
    const buttonName = $(e.currentTarget).data('codename');

    // 特殊コード判定
    if (buttonName.startsWith('party_')) {
      // パーティモード
      processPartyMode(buttonName);
      return false;
    }

    // 通常: ボタン押下イベント送信
    sendButtonEvent(buttonName, true, true);

    return false;
  });

  // デフォルトのタブを選択
  const lastSelectedTabId = localStorage.getItem('tab');
  const lastSelectedTab = $(`#${lastSelectedTabId}`);
  if (lastSelectedTabId && lastSelectedTab.length > 0) {
    lastSelectedTab.tab('show');
  } else {
    $('.nav .nav-link:first').tab('show');
    localStorage.removeItem('tab');
  }
});

/**
 * ボタン押下イベントを送信します。
 * @param {string} buttonName
 * @param {boolean} enabledProgressBar
 * @param {boolean} enabledNotify
 */
const sendButtonEvent = async (buttonName, enabledProgressBar, enabledNotify) => {
  const postUrl = `${Settings.apiBaseUrl}/?event=${buttonName}`;
  console.info(`GET: ${postUrl}`);

  if (enabledProgressBar) {
    // 信号送信リクエスト中のプログレスバー表示
    startProgressBar();
  }

  const response = await fetch(postUrl, {
    method: 'GET',
    mode: 'cors'
  });

  if (response.ok) {
    // 成功時: アラートクリア
    console.info(`Success: ${buttonName}`);

    if (enabledNotify) {
      $.notify({
        message: '信号送信に成功'
      }, {
        type: 'success',
        allow_dismiss: false,
        delay: 1000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
    }
  } else {
    // エラー発生時: アラート表示
    console.info(`Failure: ${buttonName}`);
    console.error(response);

    if (enabledNotify) {
      $.notify({
        message: '信号送信に失敗'
      }, {
        type: 'danger',
        allow_dismiss: false,
        delay: 3000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
    }
  }

  if (enabledProgressBar) {
    stopProgressBar();
  }
};

/**
 * パーティモードを処理します。
 * @param {string} buttonName
 */
const processPartyMode = buttonName => {
  if (buttonName.endsWith('_on')) {
    // パーティモード開始
    partyStartedTime = (new Date()).getTime() / 1000;

    partyTimer = setInterval(async () => {
      const now = (new Date()).getTime() / 1000;
      if (partyStartedTime && now - partyStartedTime >= Settings.PartyLimitTimeSeconds) {
        // 時間制限につき強制終了
        processPartyMode('_off');
        return false;
      }

      // シーン番号をランダムに選択
      let number = partyLatestNumber;
      while (number === partyLatestNumber) {
        // 前回の番号との重複を回避
        number = nextRandInt(Settings.PartySceneCount);
      }
      partyLatestNumber = number;

      // ボタンイベント名を生成
      const eventName = `meross_livingroom_party${number + 1}`;

      // ボタン押下送信
      sendButtonEvent(eventName, false, false);
    }, Settings.PartyIntervalMilliSeconds);

    $.notify({
      message: 'パーティモード開始'
    }, {
      type: 'success',
      allow_dismiss: false,
      delay: 3000,
      placement: {
        from: 'top',
        align: 'center'
      }
    });
  } else {
    // パーティモード終了
    clearInterval(partyTimer);
    partyTimer = null;
    sendButtonEvent(Settings.ButtonNameForPartyStopping, true, true);

    $.notify({
      message: 'パーティモード終了'
    }, {
      type: 'success',
      allow_dismiss: false,
      delay: 1000,
      placement: {
        from: 'top',
        align: 'center'
      }
    });
  }
};

/**
 * プログレスバーの進捗を開始します。
 */
const startProgressBar = () => {
  const $progressBar = $('.js-post-progress .progress-bar');
  $progressBar.attr('aria-valuenow', Number($progressBar.attr('aria-valuemin')));
  $progressBar.css('width', '0%');

  // 以前の進捗を中止
  stopProgressBar();

  // 新しい進捗を開始
  $('.js-post-progress').removeClass('d-none');
  progressBarTimer = setInterval(() => {
    const currentValue = Number($progressBar.attr('aria-valuenow'));
    const minValue = Number($progressBar.attr('aria-valuemin'));
    const maxValue = Number($progressBar.attr('aria-valuemax'));

    // 現在の進捗度を更新
    let nextValue = currentValue + 1;
    if (nextValue > maxValue) {
      nextValue = Number($progressBar.attr('aria-valuemax'));
    }
    const currentRate = ((nextValue - minValue) / (maxValue - minValue)) * 100.0;

    $progressBar.attr('aria-valuenow', nextValue);
    $progressBar.css('width', `${currentRate}%`);

    console.log(`${currentRate}%`);
  }, 100);
};

/**
 * プログレスバーの進捗を停止して非表示にします。
 */
const stopProgressBar = () => {
  $('.js-post-progress').addClass('d-none');
  clearInterval(progressBarTimer);
  progressBarTimer = null;
};

/**
 * 0から指定した値未満の整数乱数を返します。
 * @param {number} max
 */
const nextRandInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};
