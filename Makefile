DOCS = docs/index.html

all: update

update: ${DOCS}

${DOCS}:
	@echo "Fetching the latest docs from GitHub..."
	@echo "#######################################"
	curl https://raw.github.com/OwlStudios/tiramisu/stable/docs/index.html > ${DOCS}

clean:
	@echo "Cleaning..."
	@echo "###########"
	rm -f ${DOCS}
