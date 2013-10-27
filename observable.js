module.exports = function (object) {
	if (object.addObserver !== undefined) {
		return object;
	}

	var changed = false;
	var observers = [];
	var observables = [];
	var handlers = [];

	object.addObserver = function (observer) {
		observers.push(observer);
	};

	object.changed = function (state) {
		if (state === false) {
			changed = false;
		} else {
			changed = true;
		};
	};

	object.hasChanged = function () {
		return changed;
	};

	object.getObserversLength = function () {
		return observers.length;
	};

	object.deleteObserver = function (observer) {
		observers.splice(observers.indexOf(observer),1);
	};

	object.deleteObservers = function () {
		observers.length = 0;
	};

	object.notifyObservers = function () {
		if (changed === true) {
			for (var i = 0, length = observers.length; i < length; i++) {
				observers[i].apply(undefined,arguments);
			}
		}
		changed = false;
	};

	return object;
};
