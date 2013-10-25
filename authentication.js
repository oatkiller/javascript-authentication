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

	if (typeof module !== "undefined") {
		module.exports = authentication;
	}

})();
