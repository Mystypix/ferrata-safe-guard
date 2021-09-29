const API_MOCK_TIMEOUT = 500;

const sessions = {
	getSessions: async function () {
		await new Promise(resolve => setTimeout(resolve, API_MOCK_TIMEOUT));
		let sessions = localStorage.getItem('sessions');
		sessions = sessions ? JSON.parse(sessions) : [];
		sessions.sort((a, b) => b.createdTime - a.createdTime);
		return sessions;
	},
	getSession: async function (sessionId) {
		await new Promise(resolve => setTimeout(resolve, API_MOCK_TIMEOUT));
		const sessions = await this.getSessions();
		return sessions.find(session => session.id === sessionId) || null;
	},
	createSession: async function (session) {
		await new Promise(resolve => setTimeout(resolve, API_MOCK_TIMEOUT));
		const sessions = await this.getSessions();
		sessions.unshift({
			...session,
			id: Date.now().toString(16),
			createdTime: Date.now(),
		});
		localStorage.setItem('sessions', JSON.stringify(sessions));
		return sessions;
	},
	removeSession: async function (sessionId) {
		await new Promise(resolve => setTimeout(resolve, API_MOCK_TIMEOUT));
		let sessions = await this.getSessions();
		sessions = sessions.filter(session => session.id !== sessionId);
		localStorage.setItem('sessions', JSON.stringify(sessions));
		return sessions;
	},
};

export default sessions;
