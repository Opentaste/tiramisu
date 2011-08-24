DOCS = docs/index.html
INDEX = index.html

all: update

update: ${INDEX} ${DOCS}

${DOCS}:
	@echo "Fetching the latest docs from GitHub..."
	@echo "#######################################"
	curl https://raw.github.com/OwlStudios/tiramisu/stable/docs/index.html > ${DOCS}

${INDEX}:
	@echo "Fetching the latest stable version from GitHub..."
	@echo "##################################################"
	python utils/download.py

clean:
	@echo "Cleaning..."
	@echo "###########"
	rm -f ${DOCS} ${INDEX}
