function deleteUnreadPromotions() {
  var query = 'is:unread category:promotions older_than:1y';
  var start = 0;
  var max = 500; // 一度に処理する最大数
  var startTime = new Date().getTime(); // 開始時間を記録
  var maxTime = 5 * 60 * 1000; // 最大実行時間（5分）

  while (true) {
    try {
      var threads = GmailApp.search(query, start, max);
      if (threads.length === 0) {
        break;
      }

      for (var i = 0; i < threads.length; i++) {
        threads[i].moveToTrash();
      }

      Logger.log('Deleted ' + threads.length + ' email threads.');
      start += max;

      // 現在の時間をチェック
      var currentTime = new Date().getTime();
      if (currentTime - startTime > maxTime) {
        Logger.log('Approaching maximum execution time. Exiting.');
        break;
      }
    } catch (e) {
      Logger.log('An error occurred: ' + e.toString());
      break;
    }
  }
}

// 最大実行時間: 一つのスクリプトの最大実行時間は6分です（Google Workspace Business や Enterprise アカウントでは最大60分）。
// API呼び出しの制限: GmailApp の各メソッドには日次の呼び出し制限があります。
