.PHONY: build dirty before after push

build: before dirty after
dirty: $(build_www) $(build_css) $(build_js) $(build_img) $(build_fonts)

push:
	cd $(output) && git add . && git commit -m "Latest build" && git push origin master

before:
	@ git stash > /dev/null
	@ printf "\nStashing uncommitted changes\n\n"

after:
	@ git stash pop > /dev/null
	@ printf "\nUnstashing uncommitted changes\n\n"

$(build_www): $(dev_www)
	@- mkdir $(build_public)
	@- cp $(dev_www) $(build_public)

$(build_css): $(dev_scss) $(css_replace)
	@- mkdir -p $(dir $@)
	@- rm $(build_css)

	compass compile -e production --css-dir=$(dir $(build_css))
	@ cssshrink $(dir $@)main.css > $(dir $@)main-shrunk.css && mv $(dir $@)main-shrunk.css $(dir $@)main.css

	@ hash=$$(hash.sh $(dir $@)main.css); \
		replace.sh "/css/main.css" "/$$hash.main.css" $(css_replace)


$(build_js): $(dev_js) $(dev_js_templates) build.js $(js_replace)
	@- mkdir -p $(dir $@)
	@- rm $(build_js)

	r.js -o build.js out=$(dir $@)main.js

	@ replace.sh 'environment:"development"' 'environment:"staging"' "$(dir $@)main.js"

	@ hash=$$(hash.sh $(dir $@)main.js); \
		replace.sh "<script data-main=\"/js/load.js\" src=\"/vendor/requirejs/require.js\">" "<script src=\"/$$hash.main.js\">" "$(js_replace)"

$(build_img): $(dev_img)
	@- mkdir -p $(build_img)
	@ cp -R $(dev_img) $(build_img)

$(build_fonts): $(dev_fonts)
	@- mkdir -p $(build_fonts)
	@ cp -R $(dev_fonts) $(build_fonts)
