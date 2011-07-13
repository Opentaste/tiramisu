VERSION := ${shell utils/version.py}
SRC = src
 
all: minify docs

minify: ${SRC}/tiramisu-${VERSION}-min.js

${SRC}/tiramisu-${VERSION}-min.js: ${SRC}/tiramisu.js
	@echo "Minifying tiramisu.js..."
	@echo "########################"
	yuicompressor -o $@ $<
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
