const API_MOCK_TIMEOUT = 100;

const climbingSessions = {
	getSessions: async function (currentUser) {
		if (!currentUser) throw new Error('Not logged in');
		await new Promise(resolve => setTimeout(resolve, API_MOCK_TIMEOUT));
		let sessions = localStorage.getItem(`sessions-${currentUser.id}`);
		sessions = sessions ? JSON.parse(sessions) : [];
		sessions.sort((a, b) => b.createdTime - a.createdTime);
		return sessions;
	},
	getSession: async function (currentUser, sessionId) {
		if (!currentUser) throw new Error('Not logged in');
		await new Promise(resolve => setTimeout(resolve, API_MOCK_TIMEOUT));
		const sessions = await this.getSessions(currentUser);
		return sessions.find(session => session.id === sessionId) || null;
	},
	createSession: async function (currentUser, sessionInfo) {
		if (!currentUser) throw new Error('Not logged in');
		await new Promise(resolve => setTimeout(resolve, API_MOCK_TIMEOUT));
		const sessions = await this.getSessions(currentUser);
		const session = {
			...sessionInfo,
			id: Date.now().toString(16),
			createdTime: Date.now(),
		};
		sessions.unshift(session);
		localStorage.setItem(
			`sessions-${currentUser.id}`,
			JSON.stringify(sessions)
		);
		return session;
	},
	removeSession: async function (currentUser, sessionId) {
		if (!currentUser) throw new Error('Not logged in');
		await new Promise(resolve => setTimeout(resolve, API_MOCK_TIMEOUT));
		let sessions = await this.getSessions(currentUser);
		sessions = sessions.filter(session => session.id !== sessionId);
		localStorage.setItem(
			`sessions-${currentUser.id}`,
			JSON.stringify(sessions)
		);
		return sessions;
	},
};

export default climbingSessions;
