import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tsparser from '@typescript-eslint/parser';

export default [
	...vue.configs['flat/recommended'],
	{
		files: ['src/**/*.{ts,vue}'],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tsparser,
				sourceType: 'module',
				ecmaVersion: 'latest',
			},
		},
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/no-multiple-template-root': 'off',
		},
	},
];
