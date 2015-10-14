module.exports = function(grunt) {

  var themeScripts = [
    "src/head-section.js",
    "src/blog-portfolio-audio.js",
    "src/lightbox.js",
    "src/event-countdown.js",
    "src/flexslider-init.js",
    "src/background-parallax-effects.js",
    "src/animated-contents.js",
    "src/box-blur-effect.js",
    "src/portfolio-animations.js",
    "src/tabs.js",
    "src/parallax.js",
    "src/parallx-for-page-sections.js",
    "src/ajax-search.js",
    "src/hover-events.js",
    "src/ajax-portfolio.js",
    "src/love-this.js",
    "src/woocommerce-add-to-card.js",
    "src/woocommerce-loop-scripts.js",
    "src/social-share.js",
    "src/floating-go-to-top-link.js",
    "src/page-section-full-height-feature.js",
    "src/accordions-and-toggles.js",
    "src/newspaper-comments-and-share-section.js",
    "src/mainNavigation.js",
    "src/loops-isotop.js",
    "src/reloadElementsOnReload.js",
    "src/fixIsotopLayout.js",
    "src/recentWorksWidget.js",
    "src/contactForm.js",
    "src/blogLoopCarouselShortcode.js",
    "src/header-fixed.js",
    "src/headerSearchForm.js",
    "src/milestoneNumberShortcode.js",
    "src/skillMeterAndCharts.js",
    "src/googleMaps.js",
    "src/mainNavigationOnOnePageConcept.js",
    "src/swipeSlideshow.js",
    "src/edgeSlideshow.js",
    "src/elementClickEvents.js"
  ];


  var admin_scripts = [
    "../framework/admin/assets/js/backend-scripts.js"
  ];

  // var plugins = [
  //   "plugins/critical-events.js",
  //   "plugins/jquery.stickify.js",
  //   "plugins/jquery.header.js",
  //   "plugins/jquery.menu.js",
  //   "plugins/chopped.js"
  // ];

  grunt.initConfig({

    concat: {
      options: {
        separator: ";"
      },

      admin_scripts: {
        src: admin_scripts,
        dest: "../framework/admin/assets/js/backend-scripts.js"
      },

      // plugins: {
      //   // options: {
      //   //   banner: 'window.$ = jQuery;\n'
      //   // },
      //   options: {
      //     banner: ';(function($, jQuery, window) {',
      //     footer: '})(jQuery, jQuery, window);'
      //   },
      //   files: [{
      //     src: "plugins/*.js",
      //     dest: "vendors.js"
      //   }]
      // },

      themeScripts: {
        files: [{
            src: ['plugins/*.js',
                  'src/refactored/app.init.js',                   
                  'src/refactored/lib/*.js', 
                  'src/refactored/source/*.js', 
                  'src/refactored/modules/*.js', 
                  'src/refactored/app.loaded.js', 
                  themeScripts],
            dest: "scripts-vendors.js"
          }],
        options: {
          banner: ';(function($, window) {',
          footer: '})(jQuery, window);'
        }
      }

      //      development: {
      //        options: {
      //          banner: '(function($) {\n',
      //          footer: '\n}(jQuery));'
      //        },
      //        files: {
      //          "theme-scripts.js" : ["tmp/theme-scripts.js"]
      //        }
      //      },
      //
      //      production: {
      //        options: {
      //          banner: '(function($) {\n',
      //          footer: '\n}(jQuery));'
      //        },
      //        files: {
      //          "release/theme-scripts.js" : ["tmp/theme-scripts.js"]
      //        }
      //      }
    },

    clean: {
      tmp: {
        src: ["tmp"]
      }
    },

    less: {
      development: {
        files: {
          '../stylesheet/css/styles.css': ['../stylesheet/less/styles.less'],
          '../stylesheet/css/icomoon-fonts.css': ['../stylesheet/less/icomoon-fonts.less'],
          '../stylesheet/css/font-awesome.css': ['../stylesheet/less/font-awesome.less'],
          '../stylesheet/css/pe-line-icons.css': ['../stylesheet/less/pe-line-icons.less'],
          '../stylesheet/css/woocommerce.css': ['../stylesheet/less/woocommerce.less'],
          '../framework/admin/assets/stylesheet/css/admin-styles.css': ['../framework/admin/assets/stylesheet/less/admin-styles.less'],
          '../framework/admin/assets/stylesheet/css/icon-library.css': ['../framework/admin/assets/stylesheet/less/icon-library.less'],
          '../framework/admin/assets/stylesheet/css/theme-backend-styles.css': ['../framework/admin/assets/stylesheet/less/theme-backend-styles.less'],
          '../framework/admin/assets/stylesheet/css/widgets.css': ['../framework/admin/assets/stylesheet/less/widgets.less'],
          '../framework/admin/assets/stylesheet/css/chosen-select.css': ['../framework/admin/assets/stylesheet/less/chosen-select.less']
        }
      }
    },

    watch: {
      //      liveRelease: {
      //        files: ['src/*.js', 'plugins/*.js'],
      //        tasks: ['release'],
      //        options: {
      //          spawn: false
      //        }
      //      },
      liveDevelop: {
        files: ['src/*.js', 'src/refactored/*.js','plugins/*.js', 'vendors.js'],
        tasks: ['build'],
        options: {
          spawn: false
        }
      },
      adminDevelop: {
        files: ['backend-scripts.js'],
        tasks: ['build'],
        options: {
          spawn: false
        }
      },
      theme: {
        files: ['../stylesheet/less/*.less', '../framework/admin/assets/stylesheet/less/*.less'],
        tasks: ['less:development', 'build'],
        options: {
          spawn: false
        }
      }

    },
    

    uglify: {
      // plugins: {
      //   options: {
      //     compress: false
      //   },
      //   files: {
      //     'min/vendors-ck.js': ['vendors.js']
      //   }
      // },
      scripts: {
        options: {
          compress: false
        },
        files: {
          'min/scripts-vendors-ck.js': ['scripts-vendors.js'],
          'min/jquery.queryloader2.js' : ['jquery.queryloader2.js']
        }
      },
      admin_scripts: {
        options: {
          compress: false
        },
        files: {
          '../framework/admin/assets/js/min/backend-scripts-ck.js': ['../framework/admin/assets/js/backend-scripts.js']
        }
      }
    },

    cssmin: {
        my_target: {
          options : {
            report : 'gzip'
          },
          files: [{
            expand: true,
            cwd: '../stylesheet/css/',
            src: ['*.css', '!*.min.css'],
            dest: '../stylesheet/css/',
            ext: '.min.css'
          },
          {
            expand: true,
            cwd: '../framework/admin/assets/stylesheet/css/',
            src: ['*.css', '!*.min.css'],
            dest: '../framework/admin/assets/stylesheet/css/',
            ext: '.min.css'
          }]
        }
    },

    bless: {
      css: {
        options: {
          logCount: true
        },
        files: {
          '../stylesheet/css/theme-styles.min.css': '../stylesheet/css/styles.min.css'
        }
      }
    }
    

  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-bless');

  //task registration
  grunt.registerTask("default", [
    "concat:themeScripts",
    // "concat:plugins",
    "cssmin",
    "bless",
    // "uglify:plugins",
    "uglify:scripts",
    "uglify:admin_scripts",
    "clean:tmp"
  ]);

  grunt.registerTask("build", [
    "concat:themeScripts",
    // "concat:plugins",
    // "uglify:plugins",
    "cssmin",
    "bless",
    "uglify:admin_scripts",
    "uglify:scripts",
    "clean:tmp"    
  ]);

};