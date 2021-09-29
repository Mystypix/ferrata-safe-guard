const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = {
	images: {
		domains: ['emoji.gg'],
	},
	pwa: {
		dest: 'public',
		runtimeCaching,
	},
};
