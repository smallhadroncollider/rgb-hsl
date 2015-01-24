# Setup Node Module binaries in PATH
SHELL := /bin/bash
PATH  := node_modules/.bin:make/bin:$(PATH)

# Include path variables
include make/variables.make

# Include Build Scripts
include make/build.make
include make/watch.make

.PHONY: clean

clean:
	@- rm -r $(shell find $(output) -depth 1 -not -path "*.git" -not -path "*.gitignore")
