TRANSFORM_DEV =   \
	-t glslifyify   \
	-t ./lib/objify \
	-t require-key  \
	-t constantify  \
	-t brfs

TRANSFORM_PROD = $(TRANSFORM_DEV) \
	-t uglifyify

BEEFY_OPTS = --none

MODULE_BIN = node_modules/.bin
BROWSERIFY = $(MODULE_BIN)/browserify
UGLIFY     = node lib/minify.js
BEEFY      = $(MODULE_BIN)/beefy
DISC       = $(MODULE_BIN)/discify
SERVE      = $(MODULE_BIN)/serve
COLONY     = $(MODULE_BIN)/colony
HACKERS    = $(MODULE_BIN)/hacker-deps
INDEXHTML  = $(MODULE_BIN)/indexhtmlify

MAIN_PRELOAD_FILE  = dist/preload.min.js
MAIN_OUTPUT_FILE   = dist/wds.min.js
TWEAK_PRELOAD_FILE = dist/tweakable-preload.min.js
TWEAK_OUTPUT_FILE  = dist/tweakable-wds.min.js

OUTPUT_DISC   = dist/disc.html
OUTPUT_SINGLE = dist/wds.html

.PHONY: start build disc test deploy clean pages list single

# Prebuilds the required assets, before running
# a beefy live-reload server.
start:
	NODE_ENV=development node build
	make quickstart

quickstart:
	NODE_ENV=development $(BEEFY) $(BEEFY_OPTS) preloader.js:$(MAIN_PRELOAD_FILE) index.js:$(MAIN_OUTPUT_FILE) -- $(TRANSFORM_DEV) --no-debug

serve:
	$(SERVE) -SJ .

# Removes generated files.
clean:
	rm -r dist/*

# Generates the required assets and
# a production-ready build.
build:
	NODE_ENV=production node build
	make mainscript
	make tweakscript
	du -sch $(MAIN_OUTPUT_FILE)

fullbuild:
	make build disc colony hackers

mainscript:
	node build/switch-config.js tweakable false
	node build/switch-config.js mute false
	NODE_ENV=production $(BROWSERIFY) --detect-globals $(TRANSFORM_PROD) preloader.js | $(UGLIFY) > $(MAIN_PRELOAD_FILE)
	NODE_ENV=production $(BROWSERIFY) --detect-globals $(TRANSFORM_PROD) index.js | $(UGLIFY) > $(MAIN_OUTPUT_FILE)

tweakscript:
	node build/switch-config.js tweakable true
	node build/switch-config.js mute true
	NODE_ENV=production $(BROWSERIFY) --detect-globals $(TRANSFORM_PROD) preloader.js | $(UGLIFY) > $(TWEAK_PRELOAD_FILE)
	NODE_ENV=production $(BROWSERIFY) --detect-globals $(TRANSFORM_PROD) index.js | $(UGLIFY) > $(TWEAK_OUTPUT_FILE)

# List included scripts and expected images
# by file size in ascending order.
list:
	du `$(BROWSERIFY) --list $(TRANSFORM_DEV) index.js` {dist,img}/*.png audio/* | sort -n | cut -f2- | xargs du -sch

# Generates a visualisation of the required
# files' sizes using disc (http://hughsk.github.io/disc).
disc:
	NODE_ENV=production $(DISC) index.js $(TRANSFORM_PROD) > $(OUTPUT_DISC)

# Generates a visualisation of the required
# files' dependency tree using colony
# (http://hughsk.github.io/colony).
colony:
	$(COLONY) index.js -s 0.6 -o dist/colony

# Generates a hackers.txt file containing
# the names of the authors of each NPM dependency,
# ranked by percentage.
# (http://github.com/substack/hacker-deps)
hackers:
	$(HACKERS) --verbose . > hackers.txt
