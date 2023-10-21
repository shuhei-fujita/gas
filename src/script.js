/**
 * Deletes unread promotion emails older than 1 year.
 */
function deleteUnreadPromotions() {
  const query = 'is:unread category:promotions older_than:1y -is:important';
  const maxThreadsPerBatch = 500; // Maximum number of threads to process at once
  const maxExecutionTime = 5 * 60 * 1000; // Maximum execution time in milliseconds (5 minutes)
  let start = 0;
  const startTime = new Date().getTime();

  try {
    while (true) {
      const threads = fetchEmailThreads(query, start, maxThreadsPerBatch);
      if (threads.length === 0) break;

      deleteThreads(threads);
      logDeletion(threads.length);

      start += maxThreadsPerBatch;
      if (isTimeExceeded(startTime, maxExecutionTime)) break;
    }
  } catch (e) {
    logError(e);
  }
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
