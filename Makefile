VERSION := ${shell utils/version.py}
DATE := ${shell utils/version.py True}
SRC = src
 
all: beautify minify docs

minify: ${SRC}/tiramisu-${VERSION}-min.js

beautify: ${SRC}/tiramisu-beautified.js

${SRC}/tiramisu-${VERSION}-min.js: ${SRC}/tiramisu.js
	@echo "Minifying tiramisu.js..."
	@echo "########################"
	yuicompressor -o $@ $<
	@echo "\n"

${SRC}/tiramisu-beautified.js:
	@echo "Beautifying tiramisu.js..."
	@echo "##########################"
	python utils/jsbeautifier.py ${SRC}/tiramisu.js > ${SRC}/tiramisu-beautified.js
	mv ${SRC}/tiramisu-beautified.js ${SRC}/tiramisu.js
	rm -f ${SRC}/tiramisu-beautified.js
	@echo "\n"

docs/index.html:
	@echo "Generating docs..."
	@echo "##################"
	dox --title Tiramisu ${SRC}/tiramisu.js --intro utils/docs-intro.md > docs/index.html
	@echo "\n"

docs: docs/index.html

publish:
	make clean && make
	git tag -f -a ${VERSION} -m "${DATE}"
	git checkout stable
	git merge master
	git push origin stable
	make clean ../tiramisu-home/
	make ../tiramisu-home/
	git commit -am "Updated homepage to version ${VERSION}, ${DATE}" ../tiramisu-home/
	git push origin gh-pages ../tiramisu-home/

clean:
	@echo "Cleaning..."
	rm -f src/tiramisu-*-min.js
	rm -f docs/*
