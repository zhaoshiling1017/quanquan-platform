module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    execute: {
        initTables: {
          src: ['test/init_tables.js']
        },
        initDic: {
          src: ['test/init_dic.js']
        }
    }
  });

  grunt.registerTask("initTables", ['execute:initTables']);
  grunt.registerTask("initDic", ['execute:initDic']);
  grunt.registerTask('init', ['initTables' ,'initDic']);

}
