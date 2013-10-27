var makeObservable = require("./observable.js");
var currentId = 0;

var Promise = function () {
	var id = ++currentId;

	var log = function () {
		var args = Array.prototype.slice.call(arguments,0);
		console.log.apply(console,["Promise(" + id + ")"].concat(args));
	};
	var log = function () {};

	var resolveArguments, rejectArguments, oldAddObserver, oldNotifyObservers,
		noop = function () {};

	makeObservable(this);

	oldAddObserver = this.addObserver;
	this.addObserver = function () {
		var retval = oldAddObserver.apply(this,arguments);
		if (rejectArguments !== undefined || resolveArguments !== undefined) {
			log("state is final, notifying");
			this.changed(true);
			this.notifyObservers();
		}
		return retval;
	};

	oldNotifyObservers = this.notifyObservers;
	this.notifyObservers = function () {
		log("notifying ",this.getObserversLength()," with resolveArguments: ",resolveArguments," and rejectArguments ",rejectArguments);
		var retval = oldNotifyObservers.apply(this,[resolveArguments,rejectArguments]);
		this.deleteObservers();
		return retval;
	};

	this.reject = function () {
		this.resolve = this.reject = noop;
		rejectArguments = Array.prototype.slice.call(arguments,0);
		log("storing reject arguments: ",rejectArguments);
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
		log("thening it");
		this.addObserver(function (resolveArguments,rejectArguments) {
			log("then callback happening, reject: ",rejectArguments," resolve: ",resolveArguments);
			if (rejectArguments !== undefined) {
				log("calling reject");
				rejectHandler.apply(undefined,rejectArguments);
				promise.reject.apply(promise,rejectArguments);
			} else {
				log("calling resolve");
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
