const session = {
	_user: null,
	setUser: function (user) {
		this._user = user;
	},
	getUser: function () {
		return this._user;
	},
};

export default session;
