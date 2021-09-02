export const mainMenu = [
	{
		path: '/',
		component: () => import('@/pages/Main.vue'),
		children: [
			{
				path: '/',
				component: () => import('@/pages/Index.vue'),
				meta: {
					title: '首页',
					id: '首页'
				}
			},
			// 历史记录
			{
				path: '/messageService/ChannelDeploy',
				component: () => import('@/pages/messageService/ChannelDeploy.vue'),
				meta: {
					title: '历史记录',
					id: '历史记录'
				}
			}
		]
	},
	{
		path: '*', redirect: '/404'
	}
]

