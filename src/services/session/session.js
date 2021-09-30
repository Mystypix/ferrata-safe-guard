let currentSession = null
if (global.localStorage) {
	currentSession = localStorage.getItem('session')
	currentSession = currentSession ? JSON.parse(currentSession) : null
}

const session = {
	_user: currentSession,
	setUser: function (user) {
		localStorage.setItem('session', user === null ? null : JSON.stringify(user))
		this._user = user;
	},
	getUser: function () {
		return this._user;
	},
};

export default session;
