VERSION := ${shell utils/version.py}
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

clean:
	@echo "Cleaning..."
	rm -f src/tiramisu-*-min.js
	rm -f docs/*
