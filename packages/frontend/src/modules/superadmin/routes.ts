import type { RouteRecordRaw } from 'vue-router';
import LoginForm from '@/modules/auth/components/LoginForm.vue';
import AreaLayout from '@/modules/auth/components/AreaLayout.vue';

const superadminRoutes: RouteRecordRaw[] = [
	{
		path: '/superadmin/login',
		name: 'superadmin-login',
		component: LoginForm,
		props: { area: 'superadmin' },
		meta: { guestOnly: true, area: 'superadmin' },
	},
	{
		path: '/superadmin',
		component: AreaLayout,
		props: { area: 'superadmin' },
		meta: { requiresAuth: true, area: 'superadmin' },
		children: [
			{
				path: '',
				name: 'superadmin-home',
				component: () => import('./views/Dashboard.vue'),
			},
		],
	},
];

export default superadminRoutes;
