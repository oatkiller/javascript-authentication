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

	object.listenToElement = function (element,eventName,methodName) {
		this.listenTo({
			addObserver : function (handler) {
				element.addEventListener(eventName,handler,false);
			},
			deleteObserver : function (handler) {
				element.removeEventListener(eventName,handler,false);
			}
		},methodName);
	};
	
	object.listenTo = function (observable,methodName) {
		observables.push(observable);
		var handler = this[methodName].bind(this);
		handlers.push(handler);
		observable.addObserver(handler);
	};

	object.listenToEvent = function (observable,expectedEventName,methodName) {
		observables.push(observable);
		var handler = function (eventName,detail) {
			if (eventName === expectedEventName) {
				this[methodName].apply(this,arguments);
			}
		}.bind(this);
		handlers.push(handler);
		observable.addObserver(handler);
	};

	object.propagate = function (observable) {
		observables.push(observable);
		var handler = function () {
			this.changed(true);
			this.notifyObservers.apply(this,arguments);
		}.bind(this);
		handlers.push(handler);
		observable.addObserver(handler);
	};

	object.stopListening = function () {
		for (var i = 0, length = handlers.length; i < length; i++) {
			observables[i].deleteObserver(handlers[i]);
		}
	};

	return object;
};
