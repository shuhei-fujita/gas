/**
 * Deletes unread promotion emails older than 1 year and also empties the trash.
 */
function deleteUnreadPromotions() {
  const query = 'is:unread category:promotions older_than:1y -is:important';
  const maxThreadsPerBatch = 500; // Maximum number of threads to process at once
  const maxExecutionTime = 5 * 60 * 1000; // Maximum execution time in milliseconds (5 minutes)
  let start = 0;
  const startTime = new Date().getTime();
  let success = true; // Flag to indicate if the operation was successful

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
    success = false;
  } finally {
    if (success) {
      emptyTrash();
    }
    Logger.log('Operation completed.');
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
 * Empties the trash.
 */
function emptyTrash() {
  const threadsInTrash = GmailApp.getTrashThreads();
  for (let i = 0; i < threadsInTrash.length; i++) {
    threadsInTrash[i].remove();
  }
  Logger.log('Emptied the trash.');
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
 * Handles exceptions by logging and performing specific actions.
 */
function handleException(error) {
  Logger.log(`An exception occurred: ${error.toString()}`);
  // Add any specific error-handling logic here
  // For example, send an email alert, etc.
}
