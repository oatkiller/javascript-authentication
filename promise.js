var makeObservable = require("./observable.js");

var Promise = function () {

	var resolveArguments, rejectArguments, oldAddObserver, oldNotifyObservers,
		noop = function () {};

	makeObservable(this);

	oldAddObserver = this.addObserver;
	this.addObserver = function () {
		var retval = oldAddObserver.apply(this,arguments);
		if (rejectArguments !== undefined || resolveArguments !== undefined) {
			this.changed(true);
			this.notifyObservers();
		}
		return retval;
	};

	oldNotifyObservers = this.notifyObservers;
	this.notifyObservers = function () {
		var retval = oldNotifyObservers.apply(this,[resolveArguments,rejectArguments]);
		this.deleteObservers();
		return retval;
	};

	this.reject = function () {
		this.resolve = this.reject = noop;
		rejectArguments = Array.prototype.slice.call(arguments,0);
		this.changed(true);
		this.notifyObservers();
		return this;
	};

	this.resolve = function () {
		this.resolve = this.reject = noop;
		resolveArguments = Array.prototype.slice.call(arguments,0);
		this.changed(true);
		this.notifyObservers();
		return this;
	};

	this.then = function (resolveHandler,rejectHandler) {
		var promise = new Promise;
		this.addObserver(function (resolveArguments,rejectArguments) {
			if (rejectArguments !== undefined) {
				rejectHandler.apply(undefined,rejectArguments);
				promise.reject.apply(promise,rejectArguments);
			} else {
				var returnedPromise = resolveHandler.apply(undefined,resolveArguments);
				if (returnedPromise instanceof Promise) {
					returnedPromise.then(function () {
						promise.resolve.apply(promise,arguments);
					},function () {
						promise.reject.apply(promise,arguments);
					});
				}
			}
		});
		return promise;
	};

};

module.exports = Promise;
