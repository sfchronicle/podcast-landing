module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

	grunt.config.merge({
	  processhtml: {
	    dist: {
	      files: {
	        'build/wcm.html': ['build/index.html']
	      }
	    }
	  },
    htmlmin: {                                     
      dist: {                                      
        options: {   
          collapseWhitespace: true
        },
        files: {                                  
          'build/wcm.html': 'build/wcm.html'
        }
      }
    }
	});

};