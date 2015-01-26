.PHONY: build dirty before after push

build: before dirty after
dirty: $(build)/index.html $(build)/*.js $(build)/*.css

push:
	cd $(output) && git add . && git commit -m "Latest build" && git push origin master

before:
	@ git stash > /dev/null
	@ printf "\nStashing uncommitted changes\n\n"

after:
	@ git stash pop > /dev/null
	@ printf "\nUnstashing uncommitted changes\n\n"

$(build)/index.html: $(dev_public)/index.html
	@ cp $(dev_public)/index.html $@

$(build)/*.js: $(dev_public)/app.js $(build)/index.html
	@ uglifyjs $(dev_public)/app.js -m -c > $(dir $@)/app.js
	@ hash=$$(hash.sh $(dir $@)/app.js); \
		replace.sh "<script src=\"app.js\">" "<script src=\"$$hash.app.js\">" "$(js_replace)"


$(build)/*.css: $(dev_public)/vendor/skeleton/css/normalize.css $(dev_public)/vendor/skeleton/css/skeleton.css $(build)/index.html
	@ uglifycss $^ > $(dir $@)/app.css
	@ hash=$$(hash.sh $(dir $@)/app.css); \
		replace.sh "<link rel=\"stylesheet\" href=\"vendor/skeleton/css/normalize.css\">" "" "$(css_replace)"; \
		replace.sh "<link rel=\"stylesheet\" href=\"vendor/skeleton/css/skeleton.css\">" "<link rel=\"stylesheet\" href=\"$$hash.app.css\">" "$(css_replace)"

