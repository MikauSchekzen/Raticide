module.exports = function(grunt) {
	var sources = grunt.file.readJSON("sources.json");

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		concat: {
			options: {
				banner: "(function(Phaser) {\n",
				separator: "\n",
				footer: "\n})(Phaser);"
			},
			dist: {
				src: sources,
				dest: "dist/<%= pkg.name %>.js"
			}
		},

		watch: {
			src: {
				files: ["src/**"],
				tasks: ["concat"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("default", ["concat"]);
	grunt.registerTask("devwatch", ["concat", "watch"]);
};
