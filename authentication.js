var Promise = require("./promise.js");
var crypto = require("crypto");
(function () {

	var authentication = {
		User : function () {
		}
	};

	authentication.User.prototype.setUsername = function (username) {
		this.username = username.toLowerCase();
	};

	authentication.User.prototype.getUsername = function () {
		return this.username;
	};

	authentication.User.prototype.setPassword = function (password) {
		var promise = new Promise;

		if (password.length < 10) {
			promise.reject();
		} else if (password.length > 128) {
			promise.reject();
		} else if (password.length < 20 && /^[a-z]*$/.test(password) === true) {
			promise.reject();
		} else {
			this.
				hash(password).
				then(function (hash) {
					this.passwordHash = hash;
					promise.resolve();
				}.bind(this),function () {
					promise.reject();
				});
		}

		return promise;
	};

	authentication.User.getSalt = function () {
		var promise = new Promise;
		crypto.randomBytes(64,function (exception,buffer) {
			if (exception !== null) {
				promise.reject(exception);
			} else {
				promise.resolve(buffer);
			}
		});
		return promise;
	};

	authentication.User.prototype.hash = function (password) {
		var promise = new Promise;

		authentication.User.getSalt().
			then(function (salt) {

				crypto.pbkdf2(password,salt,10000,512,function (error,derivedKey) {
					if (typeof error === "undefined") {
						var hash64 = Buffer.concat([salt,derivedKey]).toString("base64");
						promise.resolve(hash64);
					} else {
						promise.reject(error);
					}
				});
			},function () {
				promise.reject.apply(promise,arguments);
			});

		return promise;
	};

	authentication.User.prototype.getPasswordMatches = function (password) {
		var promise = new Promise;

		if (typeof this.passwordHash === undefined) {
			promise.reject();
		} else {
			this.
				hash(password).
				then(function (hash) {
					if (hash === this.passwordHash) {
						promise.resolve(true);
					} else {
						promise.resolve(false);
					}
				},function () {
					promise.reject();
				});
		}
			
		return promise;
	};

	if (typeof module !== "undefined") {
		module.exports = authentication;
	}

})();
