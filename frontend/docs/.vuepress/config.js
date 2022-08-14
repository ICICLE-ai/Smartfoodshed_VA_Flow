// .vuepress/config.js
module.exports = {
    title: 'ICICLE SmartFoodshed VA',
    head: [
        ['link',{rel: 'icon', href:'/flow.png'}]
    ],
    themeConfig: {
      sidebar: {
        '/vis/': [
            {title:'visualization',path:'', children:[
                {title:'Pipeline', path:'0Pipeline'},
                {title:'Introduction to VegaLite', path:'1VegaLite'}
            ]}, 
        ]
      },
      sidebarDepth: 3,
      nav: [
        { text: 'Home', link: '/' },                      // 根路径
        { text: 'Visualization', link: '/vis/0Pipeline' },
        { text: 'External', link: 'https://google.com' }, // 外部链接
        // 显示下拉列表
        // {
        //   text: 'Visualization',
        //   items: [
        //     { text: 'Chinese', link: '/language/chinese' },
        //     { text: 'Japanese', link: '/language/japanese' }
        //   ]
        // },
        // // 下拉列表显示分组
        // {
        //   text: '高级',
        //   items: [
        //     { 
        //       text: '算法', 
        //       items: [
        //         { text: '冒泡', link: '/language/chinese' },
        //         { text: '快速', link: '/language/japanese' }
        //       ] 
        //     },
        //     { 
        //       text: '设计模式', 
        //       items: [
        //         { text: '工厂', link: '/language/chinese' },
        //         { text: '单例', link: '/language/chinese'},
        //       ] 
        //     },
        //   ]
        // }
      ]
    }
  }