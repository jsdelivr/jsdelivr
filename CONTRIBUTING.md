Adding new or updating projects.
----

Each project has its [own folder](#file-structure) in this repo.  While you could upload files via git, we recommend you add only configuration files so our [bot](https://github.com/jsdelivr/libgrabber#libgrabber) does all the work for you for current and future updates automatically.  If you want to upload older files, those will need to be [uploaded by hand](#advanced---manual).

### Adding Files for Hosting

#### Web Interface (Recommended)

*This is limited to projects that can be auto-updated by our bot. It requires github/npm/bower with tagged versions.*

1. Add configuration files using your web browser.  Visit [files/][1] and use [Github's interface](https://cloud.githubusercontent.com/assets/1834071/6826939/4019ce7a-d30d-11e4-8d1b-7821b923dd50.gif) to create a new folder with an info.ini file inside. [Documentation](https://github.com/jsdelivr/jsdelivr/blob/master/CONTRIBUTING.md#file-structure)/[Example][2].
2. Note how GitHub automatically forked the project under your username and created a `patch-N` branch for it:

    > 	youruser wants to merge 1 commit into jsdelivr:master from youruser:patch-1

3. Go to that patch, e.g. https://github.com/youruser/jsdelivr/tree/patch-1
4. In the same directory as at step 1, create an `update.json` file to enable auto-updates. [Documentation](https://github.com/jsdelivr/libgrabber#add-updatejson-schema)/[Example](https://github.com/jsdelivr/jsdelivr/blob/master/files/angular.moment/update.json).
5. Make sure both files are in the same PR (they'll be separate commits).
6. Don't add any project related files. Our bot will add them after your PR gets merged.
7. Wait for approval!

#### Advanced - Manual

 1. Fork the jsDelivr repository.
 2. Add files that you want to be synced with the CDN

  **Note** If there is a previous version of the project you are adding please ensure that the new version contains same files. For example if in the previous version there are both .min.js and .js files please add both to the new version.
  
  **Note** If you are adding a project for the first time please add only the minified version

 3. Send a pull request with a description of the changes you made including the source of the files. Please follow the same file structure as other projects in the repo.
 4. Wait for our approval.
 5. That's it!


### File Structure

Under `files/` a directory for each project is created. Please follow the instructions below (exceptions are made on a per-case basis).

1. Names should be lowercase
2. No special characters or spaces, except for `. - _`.
3. Name should only contain the name of the project. (no versions or additional information)
4. If the project is a plugin of a library, prepend the name of the library, like `jquery.blurjs` or `bootstrap.select`.

A project's directory should contain the following:

1. An `info.ini` containing all needed information. [Example][2]
2. Directories named after the version of each project.
3. The version directories can contain in their names numbers, letters and `. - _`.
4. Do not create `latest` directories; they are automatically created on our side.

A version directory should contain the following:

1. Static files needed for the project to work.
2. If there is no minified version of the main JS/CSS file, please create your own using this ([minification tool][3]).
3. If there are official or expected source maps for the minified js, please include those in the folder.  Currently, the following projects officially support the `.map` files:
  * angularjs
  * jQuery
  * mithril
4. Do not upload useless files like demos, examples, licenses, readmes and any other files not being used in the production.

### Reporting Bugs / Suggestions

Please find the correct [repo](https://github.com/jsdelivr) for your bug report or suggestion, search issues, then post if you can't find anything.  For general questions or brainstorming new ideas, you can join our [Gitter chat](https://gitter.im/jsdelivr/jsdelivr).


  [1]: https://github.com/jsdelivr/jsdelivr/tree/master/files
  [2]: https://github.com/jsdelivr/jsdelivr/blob/master/files/abaaso/info.ini
  [3]: http://refresh-sf.com/
