/**
 * config
 */
var path = require('path');

var config = {
  debug: true,

  name: 'quanquan-platform',
  description: 'A Node.js Project About Social Software',
  keywords: 'quanquan',

    // cdn host
  site_static_host: '', // 静态文件存储域名
  // 应用的域名
  host: '127.0.0.1',

  db: {
    database: 'quanquan',
    username: 'root',
    password: 'bjiamcall',
    host: '127.0.0.1',
    dialect: 'mysql'
  },

  // redis 配置，默认是本地
  redis_host: '127.0.0.1',
  redis_port: 6379,

  session_secret: 'quanquan_platform_secret',
  auth_cookie_name: 'quanquan_platform_secret',

  // 程序运行的端口
  port: 3000,

  default_page_size: 10,
  dic_prefix: 'DIC_',
  menu_dic_name: 'menu',
  project_title: '圈圈',
  dic_user_name: 'allUser',

  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },
  log: {
    file_name: 'logs/quanquan-platform.log',
    max_log_size: 10485760,
    backups: 7,
    level: 'INFO'
  },
  interface_prefix_path: '/interface',
  oneapm_license_key: 'BQEODgRRVwN4267TTV4QXg8VXE2df1FeWhsAVFcESfa0e1AASABRFQAF2c92AwMaAl1LA14='
};

module.exports = config;
