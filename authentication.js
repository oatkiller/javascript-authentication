var Promise = require("./promise.js");
var crypto = require("crypto");

var saltSize = 64;
var hashEncoding = "base64";

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

var threeInARow = /(.)\1\1/;

var heuristics = [
	/[A-Z]/,
	/[a-z]/,
	/[0-9]/,
	/[^a-zA-Z0-9]/
];
var heuristicsCount = heuristics.length;
var heuristicsRequiredToPass = 3;

authentication.User.prototype.setPassword = function (password) {
	var promise = new Promise;
	var passedHeuristics = 0;
	var i;

	if (password.length < 10 ||
			password.length > 128 ||
			password.length < 20 && /^[a-z]*$/.test(password) === true ||
			threeInARow.test(password) === true) {

		promise.reject();
		return promise;
	} else {

		for (i = 0; i < heuristicsCount && passedHeuristics < heuristicsRequiredToPass && passedHeuristics + (heuristicsCount - i) >= heuristicsRequiredToPass; i++) {
			if (heuristics[i].test(password) === true) {
				passedHeuristics++;
			}
		}

		if (passedHeuristics !== heuristicsRequiredToPass) {
			promise.reject();
			return promise;
		}
	}

	this.
		hash(password).
		then(function (hash) {
			this.passwordHash = hash;
			promise.resolve();
		}.bind(this),function () {
			promise.reject();
		});

	return promise;
};

authentication.User.prototype.getSalt = function () {
	var promise = new Promise;

	if (this.passwordHash === undefined) {
		crypto.randomBytes(saltSize,function (exception,buffer) {
			if (exception !== null) {
				promise.reject(exception);
			} else {
				promise.resolve(buffer);
			}
		});
	} else {
		var hashBuffer = new Buffer(this.passwordHash,hashEncoding);
		promise.resolve(hashBuffer.slice(0,saltSize));
	}

	return promise;
};

authentication.User.prototype.hash = function (password) {

	return this.getSalt().
		then(function (salt) {

			var promise = new Promise;

			crypto.pbkdf2(password,salt,10000,512,function (exception,derivedKey) {
				if (typeof error === "undefined") {
					promise.resolve(Buffer.concat([salt,derivedKey]).toString(hashEncoding));
				} else {
					promise.reject(exception);
				}
			});

			return promise;

		},function (exception) {
			promise.reject(exception);
		});

};

authentication.User.prototype.getPasswordMatches = function (password) {
	var promise = new Promise;

	if (typeof this.passwordHash === undefined) {
		promise.reject();
	} else {
		var passwordHash = this.passwordHash;

		this.
			hash(password).
			then(function (hash) {
				if (hash === passwordHash) {
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
