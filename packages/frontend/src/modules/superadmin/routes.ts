import type { RouteRecordRaw } from 'vue-router';
import SuperadminLayout from '@/modules/superadmin/components/SuperadminLayout.vue';

const superadminRoutes: RouteRecordRaw[] = [
	{
		path: '/superadmin',
		component: SuperadminLayout,
		meta: { requiresAuth: true, area: 'superadmin' },
		children: [
			{
				path: '',
				name: 'superadmin-espacios',
				component: () => import('./views/EspaciosView.vue'),
			},
		],
	},
];

export default superadminRoutes;
