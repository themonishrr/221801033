/**
 * Logger utility for URL Shortener application
 * Implements the mandatory logging integration requirement
 */

class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Limit the number of logs stored in memory
  }

  /**
   * Log an informational message
   * @param {string} message - The message to log
   * @param {Object} data - Additional data to include in the log
   */
  info(message, data = {}) {
    this._addLog('INFO', message, data);
  }

  /**
   * Log a warning message
   * @param {string} message - The message to log
   * @param {Object} data - Additional data to include in the log
   */
  warn(message, data = {}) {
    this._addLog('WARNING', message, data);
  }

  /**
   * Log an error message
   * @param {string} message - The message to log
   * @param {Object} data - Additional data to include in the log
   */
  error(message, data = {}) {
    this._addLog('ERROR', message, data);
  }

  /**
   * Add a log entry to the logs array
   * @param {string} level - The log level
   * @param {string} message - The message to log
   * @param {Object} data - Additional data to include in the log
   * @private
   */
  _addLog(level, message, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
    
    console.log(`[${logEntry.level}] ${logEntry.timestamp}: ${logEntry.message}`, data);
    
    this.logs.unshift(logEntry);
    
    // Trim logs if they exceed the maximum size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  /**
   * Get all logs
   * @returns {Array} - The logs array
   */
  getLogs() {
    return this.logs;
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
  }
}

// Create a singleton instance
const logger = new Logger();

export default logger;