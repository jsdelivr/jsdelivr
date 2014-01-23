# simple makefile to avoid repeatitive tasks

buildDoc:
	docco *.js

monitorDoc: build
	(while inotifywait -r -e modify,attrib,create . ; do make build; done)

server:
	python -m SimpleHTTPServer

deploy:
	# assume there is something to commit
	# use "git diff --exit-code HEAD" to know if there is something to commit
	# so two lines: one if no commit, one if something to commit 
	git commit -a -m "New deploy" && git push -f origin HEAD:gh-pages && git reset HEAD~


