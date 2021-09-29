const API_MOCK_TIMEOUT = 500;

const users = {
	getUsers: async function () {
		await new Promise(resolve => setTimeout(resolve, API_MOCK_TIMEOUT));
		let users = localStorage.getItem('users');
		users = users ? JSON.parse(users) : [];
		users.sort((a, b) => b.createdTime - a.createdTime);
		return users;
	},
	getUser: async function (userId) {
		await new Promise(resolve => setTimeout(resolve, API_MOCK_TIMEOUT));
		const users = await this.getUsers();
		return users.find(user => user.id === user) || null;
	},
	logIn: async function (username, password) {
		await new Promise(resolve => setTimeout(resolve, API_MOCK_TIMEOUT));
		const users = await this.getUsers();
		return (
			users.find(
				user => user.username === username && user.password === password
			) || null
		);
	},
	createUser: async function (userInfo) {
		await new Promise(resolve => setTimeout(resolve, API_MOCK_TIMEOUT));
		const users = await this.getUsers();
		const user = {
			...userInfo,
			id: Date.now().toString(16),
			createdTime: Date.now(),
		};
		users.unshift(user);
		localStorage.setItem('users', JSON.stringify(users));
		return user;
	},
	removeUser: async function (sessionId) {
		await new Promise(resolve => setTimeout(resolve, API_MOCK_TIMEOUT));
		let users = await this.getUsers();
		users = users.filter(user => user.id !== sessionId);
		localStorage.setItem('users', JSON.stringify(users));
		return users;
	},
};

export default users;
