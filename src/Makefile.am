nodist_bin_SCRIPTS = emoji-keyboard
nodist_pkgdata_SCRIPTS = com.evanwelsh.EmojiKeyboard

resource_files = $(shell $(GLIB_COMPILE_RESOURCES) --sourcedir=$(srcdir) --generate-dependencies $(srcdir)/com.evanwelsh.EmojiKeyboard.src.gresource.xml)
com.evanwelsh.EmojiKeyboard.src.gresource: com.evanwelsh.EmojiKeyboard.src.gresource.xml $(resource_files)
	$(AM_V_GEN) $(GLIB_COMPILE_RESOURCES) --target=$@ --sourcedir=$(srcdir) $<

resourcedir = $(pkgdatadir)
resource_DATA = com.evanwelsh.EmojiKeyboard.src.gresource

# Legacy, until we can depend on package.js provided by gjs
jsdir = $(pkgdatadir)
dist_js_DATA = package.js

emoji-keyboard: emoji-keyboard.in
	$(AM_V_GEN) sed \
		-e "s|[@]GJS@|$(GJS)|g" \
		-e "s|[@]PACKAGE_VERSION@|$(PACKAGE_VERSION)|g" \
		-e "s|[@]prefix@|$(prefix)|g" \
		-e "s|[@]libdir@|$(libdir)|g" \
		-e "s|[@]pkgdatadir@|$(pkgdatadir)|g" \
		$< > $@
	@chmod +x $@

com.evanwelsh.EmojiKeyboard: com.evanwelsh.EmojiKeyboard.in
	$(AM_V_GEN) sed \
		-e "s|[@]GJS@|$(GJS)|g" \
		-e "s|[@]PACKAGE_VERSION@|$(PACKAGE_VERSION)|g" \
		-e "s|[@]prefix@|$(prefix)|g" \
		-e "s|[@]libdir@|$(libdir)|g" \
		-e "s|[@]pkgdatadir@|$(pkgdatadir)|g" \
		$< > $@
	@chmod +x $@

EXTRA_DIST = \
	com.evanwelsh.EmojiKeyboard.in \
	emoji-keyboard.in \
	com.evanwelsh.EmojiKeyboard.src.gresource.xml \
	$(resource_files)

CLEANFILES = \
	com.evanwelsh.EmojiKeyboard \
	emoji-keyboard \
	com.evanwelsh.EmojiKeyboard.src.gresource

-include $(top_srcdir)/git.mk
