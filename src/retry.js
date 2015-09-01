'use strict';

var retry = (function() {

  var or = function(x, y) {
    return typeof x !== 'undefined' ? x : y;
  };

  function Response(data, failed) {
    this.data = data;
    this.failed = failed;
  }

  var retry = {

    INFINITE: 'infinite',

    BACKOFF_FUNCTION_EXPONENTIAL_NO_JITTER: function(attempts, delay) {
      return Math.pow(2, attempts) * delay;
    },

    BACKOFF_FUNCTION_EXPONENTIAL_JITTER: function(attempts, delay) {
      var unjittered = retry.BACKOFF_FUNCTION_EXPONENTIAL_NO_JITTER(attempts, delay);
      var jitter = ((Math.random() + 0.5) / 10) * unjittered;
      if (Math.random() > 0.5) {
        return unjittered + jittered;
      } else {
        return unjittered - jittered;
      }
    },

    run: function(func, config) {

      var expectedResult = or(config.expectedResult, true);
      var retryAfter = or(config.retryAfter, 1000);
      var maxAttempts = or(config.maxAttempts, retry.INFINITE);
      var backoff = or(config.backoff, false)
      var backoffFunction = or(config.backoffFunction, retry.BACKOFF_FUNCTION_EXPONENTIAL_JITTER)
      var backoffMaxWait = or(config.backoffMaxWait, Number.MAX_VALUE);

      return new Promise(function(resolve, reject) {
        var attempts = 0;

        var validate = function(response) {
          attempts++;
          if (!response.failed && response.data === expectedResult) {
            resolve(response.data);
          } else {
            if (attempts === maxAttempts) {
              reject();
            } else {
              var delay = retryAfter;
              if (backoff) {
                delay = Math.min(backoffFunction(attempts, retryAfter), backoffMaxWait);
              }
              setTimeout(runner, delay);
            }
          }
        };

        var runner = function() {
          var data = func.call();
          if (data instanceof Promise) {
            data.then(
              function(data) {
                validate(new Response(data, false));
              },
              function(error) {
                validate(new Response(error, true));
              });
          } else {
            validate(new Response(data, false));
          }
        };

        runner();
      });
    }

  };

  return retry;
})();


if (typeof module !== 'undefined') {
  module.exports = retry;
}
