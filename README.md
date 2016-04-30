#GULPINATOR

A gulp-based workflow, intended for personal use. I realize there are better, more
advanced solutions and bundles out there. The purpose of this project was mostly
to learn gulp and node, and create a configuration that's perfectly suited to the
needs of me and my team.

Improvements and bugfixes are, of course, always welcome.

The main focus of this gulp workflow was to provide a flow suited to many different,
small scale projects, which can be easily configured with a json file without the need
for any gulp knowledge. Flexibility and configurability are key. For it's intented use,
see the Overview section.

Note: This is still a work in progress.

##Contents

1. Installation
2. Overview
3. Configuration
4. Intended project structure
5. Work in progress: Wishlist

##1. Installation

Install using npm.

`npm install gulpinator`

Create a *gulpfile.js* in your project root, containing just this line:

`require('gulpinator').initGulp();`

Since this is a basic gulpfile, you can choose to add additional tasks here.

For the default configuration of babel, jshint, jscs, bower and gulpinator itself,
run

`gulp init`

This will copy the default, suggested configuration files from *gulpinator/defaults*
to your current active directory.

##2.Overview
This opinionated gulp-automated workflow assumes you want to build your entire project to a single destination folder, bundle your assets, write your stylesheets with Sass, javascript in ES6, use browsersync for HMR (Hot Module Reloading) and optionally use Angular. It doesn't currently support any HTML templating, like Jade or Mustache. (See the Work In Progress section) Within these confines, it attempts to be as flexible as possible.

###Gulp tasks
* `gulp init` Initializes gulpinator. It will copy all default configuration files from gulpinator, such as *.jscsrc* or *.babelrc* to your project root.
* `gulp build` Build the entire project.
* `gulp serve` Build and serve the project using browsersync.
* `gulp clean` Clears the build folder of everything except images.

###Secondary Gulp tasks
* `gulp compile-sass` Compile sass files to css.
* `gulp compile-scripts` Compile, minify,... .js files.
* `gulp compile-images` Optimizes images in the assets folder.
* `gulp compile-angular-scripts` Compiles angular files and takes care of angular dependency injection.
* `gulp compile-template-cache` Compiles angular html templates to the template cache of it's app in a .js file.
* `gulp bundle-libs` Bundles all chosen library files.
* `gulp move-additional-files` Moves all additional files to the build folder.
* `gulp build-inject` Injects css and js files into html files.

##3. Configuration
Gulpinator uses a basic .js configuration file. (I've chosen for .js over .json for some added flexibility and to be able to add comments, explaining each configuration property) It will use it's default configuration file (*gulpinator/defaults/gulp.config.js*), unless you overwrite it by placing your own *gulp.config.js* in your project's root. (at the same level as *gulpfile.js*)

###Options
All default options (for a `gulp build` or `gulp serve` without environment argument) are found as properties of the *default* object in the config.

* **assetsSrc**: (Path) The folder containing all your html, css, styles, images, fonts,...
* **defaultDest**: (Path) The desired build folder. After running'gulp build', this folder should contain all the compiled code and files according to the specifications defined below, once you've run the `gulp build` command.
* **additionalFiles**: (Path) The entire folder/file structure in the folder defined below will simply be copied into the defaultDest folder. Note that these folders will be added to the defaultDest without the root additionalFiles folder.
* **angular**: (Object) This object contains the configuration options if yoe are building an angular project.
	* **isAngularProject**: (Boolean) Set this boolean to false if you're not making an angular project. All below properties of the angular object will be ignored if set to false.
	* **appName**: (String) The name of your main angular application. See the angular subsection in *4.2. Using Angular* for more information.
	* **angularSrc**: (Path) The path to your angular source folder.
	* **singleModule**: (Boolean) Wether you want to concatenate the entire angular application in one file, or create seperate file for each module. (See *4.2. Using Angular* for more information.)
* **es6**: (Boolean) Activate es6 mode with babel. Configure in *.babelrc* file.
* **rev**: (Boolean) Add hashes to each asset, to allow cache busting. Suggested in production. *Note: you will not be able to inject css/js with browsersync using this method*
* **jshint**: (Boolean) Use jsHint for javascript linting. Configure in *.jshintrc*.
* **jscs**: (Boolean) Use jscs for javascript style checking. Configure in *.jscsrc*.
* **verbose**: (Boolean) Gulpinator will print additional info in the console.
* **minify**: (Boolean) Use minification for default js tasks. (can be overwritten in libraries and bundles property)
* **sourceMaps**: (Boolean) Use sourcemaps, both for js and css.
* **useHtmlInjection**: (Boolean) Use automated HTML injection, both for css and js. See *4.5. HTML Injection* for more info.
* **browsersync**: (Object) Configuration object for browsersync.
	* **port**: (Integer) The port to run your locally hosted project on through browsersync.
	* **isProxy**: (Boolean) Wether to run this browsersync instance as a proxy for a server, for example, a Node server on port 3000 serving all your assets, being rerouted through browsersync to port 8000.
	* **proxyTarget**: (Integer) The port of the original server. In the above example, this would be 3000.
	* **websockets**: (Boolean) Set to true to allow websockets support with browsersync.
	* **debug**: (Boolean) Verbose version of browsersync.
* **libraries**: (Array) Define seperate bundles for your libraries. There are three main options for including libraries in this workflow.
	1. Add libraries through a CDN or external link, directly into the HTML In this case, just supply an empty array to the libraries property
	2. Create one large library bundle, concatenating all it's files and automatically injecting the resulting bundle into the HTML.
	3. Create multiple library bundles, injecting them into the HTML where desired. See scriptsPerPage property below for more details.
Note that with options 2 and 3 we can do our own minification, which might be handy if not all of the chosen libraries supply a .min.js file. Each object in the **libraries** array follows this structure:
		* **name**: (String) The name of the bundled file.
		* **minify** (Boolean) Wether to minify this bundle.
		* **sources** (Array) An array of path strings, pointing to the files you want to bundle.
* **bundles**: (Array) Works the same as the **libraries** bundle above, but for scripts in your assets folder. If empty, Gulpinator will default to concatenating everything in assets in a single .js file. If not, it will only concatenate the scripts defined in here.
* **extraStylesheets**: (Path) Define extra stylesheets you want included in *main.css*. Also possible with sass, but I've put this here so all build configuration stays in one file.
* **seperateBundlesPerPage**: (Object) If you want to add seperate script bundles to seperate html pages but want to use automated injection, you can define an array of all desired bundles with an array of the pages they should be in. Don't supply the full path for these files, just the name without the suffix. So assets/index.html simply becomes 'index'.
	* **use**: (Boolean) Set to false if you do not want to bundle your files seperately like this.
	* **pages**: (Array) An array of objects, with the following properties:
		* **names**: (Array) Contains the names (String) of all .html files to inject these bundles in.
		* **styleBundles**: (Array) Contains the names (String) of all .css bundles for these .html files.
		* **scriptBundles**: (Array) Contains the names (String) of all .js bundles for these .html files, including libraries.
* **paint**: (String) Choose which image to paint. 'Bazookas' or 'Gulpinator'. Leave empty to paint nothing and be boring.


###Environment variables
All the options in the above described *default* object can be overriden with environment variables. Simply create a new object in the *config* object of *gulp.config.js*. The name of this object will be the environment variable used when you want to let Gulpinator use these options. All options defined in this object will overwrite those from the *default* object, so you should only define those you actually want to change. You can use the options from such an object like so:
`gulp build --env=myEnvName`


##4. Intented project structure

###4.1. Suggested Folder structure
```
.
+-- angular
|   +-- common
	|   +-- controllers
	|   +-- directives
	|   +-- filters
	|   +-- services
|   +-- modules
	 |   +-- module1
		 |   +-- controllers
		 |   +-- directives
		 |   +-- filters
		 |   +-- services
	 |   +-- module2
	 	 ...
	 ...
|   +-- templates
|   +-- app.js
+-- assets
|   +-- img
|   +-- styles
|   +-- js
+-- node_modules
+-- public
|   +-- img
|   +-- scripts
|   +-- styles
|   +-- templates
|   +-- index.html
+-- vendor
+-- ...
```

###4.2. Using Angular
Only applies when **angular.isAngularProject** is set to true, of course.

The **angular** folder contains all our angular-specific code. The **common** subdirectory contains all directives, controllers, filters and services used by our main 'root' angular module. This means functionality used throughout the app that don't benefit from further abstraction or seperation into it's own modules. In very large projects, it's desireable to use further subdirectories in **common**, each with their own **controllers**, **directives**, **filters** and **services** subdirectories.

The **modules** subdirectory contains all seperate angular modules of our app. Read [this article](http://henriquat.re/modularizing-angularjs/modularizing-angular-applications/modularizing-angular-applications.html) if you want to know why seperation into models is a good idea. Each module again follows the **controllers**, **directives**, **filters** and **services** subdirectory structure. Each modules subfolder should also contain a **moduleName.js** file which serves as the base file for this module. If it's a small module, the subdirectories might not be necessary.

The **templates** directory contains the *.html* templates our directives use as template. The gulp `build`and `serve`commands will take care of compiling these templates and injecting them in `$templateCache`. All templates in the root **templates** directory will be placed in the `$templateCache` of the angular app. Every subdirectory in **templates** points to a module. Make sure the names of these directories match those of the modules in **angular/modules**! The templates within each of these directories will then be placed in the `$templateCache` of that module.

**app.js** is the root of our angular project

###4.3. Assets
The name of this folder can be changed in the configuration file.
This folder contains additional assets.

The **styles** subdirectory contains, of course, our styles (using sass). The **js** subdirectory contains any aditional js files used in the project.

**assets** also contains an *img* folder. All .jpeg, .png, .gif and .svg images in this folder will be optimized and placed in the *public* folder.

Finally, **assets** contains our regular html files, like index.html.

###4.4 Public
All our development code will be compiled to this folder. The name can also be changed in the configuration file.

###4.5. HTML Injection
It's possible to use automated injection of css files in our html templates. All you need to do is set the correct configuration (detailed above) and add the following html comments to your .html files:

```
<html>
	<head>
		<!-- inject:css -->
  		<!-- compiled and cleaned stylesheets will be injected here -->
  		<!-- endinject -->
	</head>
	<body>
	...
	<!-- libs:js -->
	<!-- external libraries which were bundled (as defined in gulp.config.json) will be injected here -->
	<!-- endinject -->

	<!-- angular:js -->
	<!-- inject compiled angular module(s) here -->
	<!-- endinject -->

	<!-- inject:js -->
	<!-- compiled, bundled and minified scripts will be injected here -->
	<!-- endinject -->
	</body>
</html>
```


##5. Work in progress: Wishlist

###More control over order of injection
Right now, it's not possible to really order the individual library or script bundles. Either I solve this in the next version, or I switch to webpack to handle this for me.

###Webpack integration
I'd like to optionally integrate Webpack for a more robust and advanced module bundling
solution. The actual gulp tasks would focus on all the non-bundling tasks, while Webpack
handles asset bundling of css, js and html. (and optionally jsx and other derived file
formats.)

###Unit test support
I need to add more support for unit testing, but haven't yet decided on the best approach
for this. Once I've tested and decided on a technology stack for unit and/or integration
tests, I'll start automating it in here.

###CMS integration
Currently, Gulpinator has just been tested for stand-alone, small web application. I'd like
to check out what's necessary to integrate it seemlessly in the CMS' currently used by
my team. (Kunstmaan CMS and Sails.js)

###Add HTML templating support
Add support for several HTML templating preprocessors, like Jade, Mustache, Handlebars,...
