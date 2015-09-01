# retry
Tiny javascript library that simplifies retry handling.

## About

Retry.js makes retry handling, with or without backoff a breeze. There's even support for Promises/A+ compatible tasks!

```javascript

var myFunctionThatMightFail = function() {
	// Post some data to the backend ...
	return everythingIsOkay ? 'OK' : 'FAIL';
};

var config = {
	retryAfter: 1000,
	maxAttempts: 3,
	expectedResult: 'OK'
};

retry.run(myFunctionThatMightFail, config)
	.then(function() {
		// myFunctionThatMightFail returned true
	})
	.catch(function() {
		// myFunctionThatMightFail failed 3 times
	});
```

## Dependencies

Retry.js uses Promises/A+, if you need to support older browsers please use libs/retry-promise-VERSION.min.js that contains an ES6 polyfill for Promises, or libs/retry-VERSION.min.js if you provide your own polyfill.

## NPM

Retry.js is available on NPM, you can find it at http://npmjs.com/package/retry.js

## Configuration

Valid configuration parameters are:

####expectedResult

Default: **true**

Functions return value when executed successfully.

####retryAfter

Default: **1000**

How long to wait before trying again after an unsuccessful execution. Value in milliseconds.

####maxAttempts

Default: **retry.INFINITE**

How many times to retry before failing. Defaults to never.

####backoff

Default: **false**

Should we back off when retrying? That is, should we increase the time between each retry.

####backoffFunction

Default: **retry.BACKOFF_FUNCTION_EXPONENTIAL_JITTER**

Only used if backoff is enabled.

What function to use for calculating the backoff time. There's 2 functions provided, retry.BACKOFF\_FUNCTION\_EXPONENTIAL\_JITTER and retry.BACKOFF\_FUNCTION\_EXPONENTIAL\_NO\_JITTER, but you could also provide your own.

If you provide your own just make sure your function takes two parameters, number of attempts made and the original delay. It should return the next wait in milliseconds.

####backoffMaxWait

Default: **Number.MAX_VALUE**

Only used if backoff is enabled.

The maximum amount of time to wait before trying again.

## Contributions

Are welcome!

Project setup is simple, spm install in the root of the project and then you're good to go.

The Gruntfile should be fairly self explanatory.


## Examples

### Syncronous task

```javascript
// Syncronous task that succeeds on the 3rd try
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

var config = {
	retryAfter: 300,
	expectedResult: 'OK',
	maxAttempts: 5
};

retry.run(syncTask, config)
	.then(function(result) {
		// Task executed successfully
	})
	.catch(function() {
		// Task failed 5 times
	});
```

### Asyncronous task

```javascript
// Asyncronous task that succeeds on the 3rd try
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

var config = {
	retryAfter: 300,
	expectedResult: 'OK',
	maxAttempts: 5
};

retry.run(asyncTask, config)
	.then(function(result) {
		// Task executed successfully
	})
	.catch(function() {
		// Task failed 5 times
	});

```
