// PM2 Ecosystem File — VentaCore
// Gestiona el proceso de la API NestJS en producción.
module.exports = {
	apps: [
		{
			name: 'ventacore-api',
			cwd: '/home/ubuntu/ventacore/packages/api',
			script: 'lib/api/src/main.js',
			node_args: '--require reflect-metadata',
			instances: 1,
			exec_mode: 'fork',
			env_file: '/home/ubuntu/ventacore/.env.production',
			env: {
				NODE_ENV: 'production',
			},
			// Reinicio automático
			autorestart: true,
			max_restarts: 10,
			restart_delay: 5000,
			// Logs
			log_date_format: 'YYYY-MM-DD HH:mm:ss',
			error_file: '/home/ubuntu/logs/ventacore-error.log',
			out_file: '/home/ubuntu/logs/ventacore-out.log',
			merge_logs: true,
			// Monitoreo
			max_memory_restart: '300M',
		},
	],
};
