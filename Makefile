HTMLS := \
	data/html/desarrollo-humano.html \
	data/html/esperanza-vida.html \
	data/html/conocimiento.html \
	data/html/bienestar-material.html

CSV := data/csv/desarollo-humano.csv
JSON := data/json/desarollo-humano.json

update: $(CSV) $(JSON)

$(HTMLS):
	curl \
		http://www.pnud.or.cr/mapa-cantonal/$(@F) \
		--output $@ \
		--compressed \
		--progress \
		--fail

$(CSV): scripts/html2csv.js node_modules $(HTMLS)
	node $< $(HTMLS) > $@

$(JSON): scripts/csv2json.js node_modules $(CSV)
	node $< $(CSV) > $@

node_modules: package.json
	npm install
	touch $@

.PHONY: update
