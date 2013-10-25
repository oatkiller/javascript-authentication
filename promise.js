var Promise = function (underlyingFunction) {
	var thenCallbacks;
	var rejectCallbacks;
	var nextPromises;
	var i;

	this.resolve = function () {
		this.resolve = this.reject = function () {};

		if (thenCallbacks !== undefined) {
			for (i = 0, length = thenCallbacks.length; i < length; i++) {
				thenCallbacks[i].apply(undefined,arguments);
			}
		}
	};

	this.reject = function () {
		this.resolve = this.reject = function () {};

		if (rejectCallbacks !== undefined) {
			for (i = 0, length = rejectCallbacks.length; i < length; i++) {
				rejectCallbacks[i].apply(undefined,arguments);
			}
		}
		if (nextPromises !== undefined) {
			for (i = 0, length = nextPromises.length; i < length; i++) {
				nextPromises[i].reject.apply(nextPromises[i],arguments);
			}
		}
	};

	this.then = function (callback,errorCallback) {
		var nextPromise = new Promise;

		if (nextPromises === undefined) {
			nextPromises = [];
		}

		nextPromises.push(nextPromise);

		if (thenCallbacks === undefined) {
			thenCallbacks = [];
		}

		thenCallbacks.push(function () {
			var result = callback.apply(undefined,arguments);
			if (result instanceof Promise) {
				result.then(function () {
					nextPromise.resolve.apply(nextPromise,arguments);
				},function () {
					nextPromise.reject.apply(nextPromise,arguments);
				});
			} else {
				nextPromise.resolve(result);
			}
		});

		if (rejectCallbacks === undefined) {
			rejectCallbacks = [];
		}

		rejectCallbacks.push(errorCallback);
		return nextPromise;
	};

};

module.exports = Promise;
