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
    const postUrl = `${Settings.apiBaseUrl}/?event=${buttonName}`;
    console.info(`GET: ${postUrl}`);

    // 信号送信リクエスト中のプログレスバー表示
    $('.js-post-progress').removeClass('d-none');
    const $progressBar = $('.js-post-progress .progress-bar');
    $progressBar.attr('aria-valuenow', Number($progressBar.attr('aria-valuemin')));
    $progressBar.css('width', '0%');
    if (progressBarTimer !== null) {
      clearInterval(progressBarTimer);
    }
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
    }, 100);

    fetch(postUrl, {
      method: 'GET',
      mode: 'cors'
    }).then(response => {
      $('.js-post-progress').addClass('d-none');
      clearInterval(progressBarTimer);
      progressBarTimer = null;

      if (response.ok) {
        // 成功時: アラートクリア
        console.info(`Success: ${buttonName}`);

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
      } else {
        // エラー発生時: アラート表示
        console.info(`Failure: ${buttonName}`);
        console.error(response);

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
    });

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
