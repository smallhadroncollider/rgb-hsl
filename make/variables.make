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
output			:=		/Users/mark/project-builds/
build_public	:=		$(output)/public

build_www		:=		$(build_public)
build_css		:=		$(build_public)/*.css
build_js		:=		$(build_public)/*.js
build_img		:=		$(build_public)/img/
build_fonts		:=		$(build_public)/fonts/

js_replace		:=		$(build_public)/index.html
css_replace		:=		$(build_public)/index.html
