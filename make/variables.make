####################
# Make directories #
####################
refs			:=		make/.refs

###########################
# Development directories #
###########################
dev_public		:=		public
dev_js			:=		$(shell find $(dev_public)/js -name "*.js")
# dev_scss		:=		$(shell find $(dev_public)/scss -name "*.scss")
# dev_css			:=		$(dev_public)/css/main.css

#####################
# Build directories #
#####################
build			:=		/Users/mark/project-builds/smallhadroncollider-labs/rgb-hsl

js_replace		:=		$(build)/index.html
css_replace		:=		$(build)/index.html
