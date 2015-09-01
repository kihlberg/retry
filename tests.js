describe('retry', function() {

  var syncTask = (function() {
    var fails = 0;
    return function() {
      fails++;
      if (fails !== 2) {
        return '';
      } else {
        return 'OK';
      }
    };
  })();

  var asyncTask = (function() {
    var fails = 0;
    return function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          if (fails === 2) {
            resolve('OK');
          } else {
            fails++;
            reject();
          }
        }, 0);
      });
    };
  })();

  it('should handle sync tasks', function(done) {
    var config = {
      retryAfter: 1,
      expectedResult: 'OK'
    };

    retry.run(syncTask, config)
      .then(function(result) {
        expect(result).toEqual(config.expectedResult);
        done();
      })
      .catch(function() {
        done.fail('Sync task support is broken');
      });
  });

  it('should handle async tasks', function(done) {
    var config = {
      retryAfter: 1,
      expectedResult: 'OK',
      backoff: false
    };
    retry.run(asyncTask, config)
      .then(function(result) {
        expect(result).toEqual(config.expectedResult);
        done();
      })
      .catch(function() {
        done.fail('Async tasks support is broken');
      });
  });

});
