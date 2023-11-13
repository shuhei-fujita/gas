/**
 * Deletes unread promotion emails older than 1 year.
 */
function deleteUnreadPromotions() {
  // https://support.google.com/mail/answer/7190?hl=ja
  // 日（d）、月（m）、年（y）で期間を指定して、それより古いメールか新しいメールを検索します
  const deletePeriod = '6m'; 
  const query = `is:unread category:promotions older_than:${deletePeriod} -is:important`;
  const maxThreadsPerBatch = 500; // Maximum number of threads to process at once
  const maxExecutionTime = 5 * 60 * 1000; // Maximum execution time in milliseconds (5 minutes)
  let start = 0;
  let totalDeleted = 0; // 削除されたスレッドの合計数を追跡する変数
  const startTime = new Date().getTime();

  try {
    while (true) {
      const threads = fetchEmailThreads(query, start, maxThreadsPerBatch);
      if (threads.length === 0) break;

      deleteThreads(threads);
      logDeletion(threads.length);
      totalDeleted += threads.length; // 合計を更新

      start += maxThreadsPerBatch;
      if (isTimeExceeded(startTime, maxExecutionTime)) break;
    }
  } catch (e) {
    logError(e);
    return { 'error': e.toString() }; // エラー情報を返す
  }

  return { 'deletedCount': totalDeleted }; // 削除されたメールの数を返す
}

/**
 * Fetches email threads based on the query.
 */
function fetchEmailThreads(query, start, max) {
  return GmailApp.search(query, start, max);
}

/**
 * Moves the given email threads to trash.
 */
function deleteThreads(threads) {
  threads.forEach(thread => thread.moveToTrash());
}

/**
 * Logs the number of deleted email threads.
 */
function logDeletion(count) {
  Logger.log(`Deleted ${count} email threads.`);
}

/**
 * Checks if the maximum execution time is exceeded.
 */
function isTimeExceeded(startTime, maxTime) {
  const currentTime = new Date().getTime();
  if (currentTime - startTime > maxTime) {
    Logger.log('Approaching maximum execution time. Exiting.');
    return true;
  }
  return false;
}

/**
 * Logs errors.
 */
function logError(error) {
  Logger.log(`An error occurred: ${error.toString()}`);
}

/** 
HTTPリクエストを受けたときに deleteUnreadPromotions() 関数を実行
その結果をHTTPレスポンスとして返す処理を実装します。
今は 'e' を使用していませんが、将来的にリクエストの詳細を取得する場合に使えます。
*/
/**
 * HTTP GET リクエストを処理する関数。
 */
function handleRequest(e) {
  Logger.log(e);
  if (e.parameter.action === 'deleteUnreadPromotions') {
    var result = deleteUnreadPromotions();
    if (result.error) {
      return sendResponse(500, { 'status': 'error', 'message': result.error });
    } else {
      return sendResponse(200, { 'status': 'success', 'deletedCount': result.deletedCount });
    }
  } else {
    return sendResponse(400, { 'status': 'error', 'message': 'Invalid action' });
  }
}

/**
 * HTTP GET リクエストを処理する関数。
 */
function doGet(e) {
  try {
    return handleRequest(e);
  } catch (error) {
    Logger.log(error);
    return sendResponse(500, { 'status': 'error', 'message': error.toString() });
  }
}

/**
 * HTTP POST リクエストを処理する関数。
 */
function doPost(e) {
  try {
    return handleRequest(e);
  } catch (error) {
    Logger.log(error);
    return sendResponse(500, { 'status': 'error', 'message': error.toString() });
  }
}

// ステータスコードとレスポンスをJSONで返すヘルパー関数
function sendResponse(statusCode, body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON)
    .setStatusCode(statusCode);
}
