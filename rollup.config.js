import commonjs from '@rollup/plugin-commonjs';

export default {
	// ... other Rollup configurations
	plugins: [
		commonjs({
			dynamicRequireTargets: [
				'@libsql/linux-x64-gnu' // Or other platform-specific targets if needed
				// Add other dynamically required modules here if they cause issues
			]
		})
		// ... other plugins
	]
};
