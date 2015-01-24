####################
# Make directories #
####################
refs			:=		make/.refs

###########################
# Development directories #
###########################
dev_public		:=		public
dev_www			:=		$(shell find $(dev_public) -type f -depth 1 -not -path "*.DS_Store")
dev_js			:=		$(shell find $(dev_public)/js -name "*.js")
dev_js_templates:=		$(shell find $(dev_public)/js/templates -name "*.html")
dev_scss		:=		$(shell find $(dev_public)/scss -name "*.scss")
dev_css			:=		$(dev_public)/css/main.css
dev_img			:=		$(shell find $(dev_public)/img -type f -not -path "*.DS_Store")
dev_fonts		:=		$(dev_public)/fonts/.

#####################
# Build directories #
#####################
output			:=		/Users/mark/project-builds/
build_public	:=		$(output)/public

build_www		:=		$(build_public)
build_css		:=		$(build_public)/*.css
build_js		:=		$(build_public)/*.js
build_img		:=		$(build_public)/img/
build_fonts		:=		$(build_public)/fonts/

js_replace		:=		$(build_public)/index.html
css_replace		:=		$(build_public)/index.html
