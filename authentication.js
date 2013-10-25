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
		return crypto.randomBytes(64);
	};

	authentication.User.prototype.hash = function (password) {
		var promise = new Promise;
		var salt = authentication.User.getSalt();

		crypto.pbkdf2(password,salt,10000,512,function (error,derivedKey) {
			if (typeof error === "undefined") {
				promise.resolve(salt + derivedKey.toString());
			} else {
				promise.reject(error);
			}
		});

		console.log('arst');
		return promise;
	};

	authentication.User.prototype.getPasswordMatches = function (password) {
		var promise;
		promise = new Promise;

		if (typeof this.passwordHash === undefined) {
			promise.reject();
			return promise;
		}

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
			
		return promise;
	};

	if (typeof module !== "undefined") {
		module.exports = authentication;
	}

})();
