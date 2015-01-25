.PHONY: watch

watch: $(refs)/index.ref $(dev_public)/app.js

$(refs)/index.ref: public/index.html
	@ touch $@
	@ chrome-canary-cli reload

$(dev_public)/app.js: $(dev_js)
	@ browserify $(dev_public)/js/main.js > $@
	@ chrome-canary-cli reload
	# @ check=""; \
	# 	for i in $?; do \
	# 		if [ $$(printf "%s" $$i | tail -c 3) = ".js" ]; then \
	# 			check="$$check $$i"; \
	# 		fi \
	# 	done; \
	# 	jshint $$check; \
	# 	buddy $$check;

$(dev_css): $(dev_scss)
	@ compass compile && terminal-notifier -message "Compass Compiled" -title "Compass" -group temp && sleep 1 && terminal-notifier -remove temp
	@ touch $@
	@ chrome-canary-cli reload

