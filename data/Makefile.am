# I chose to use recursive automake so I can use nobase_ and avoid
# 5 different directory declarations
SUBDIRS = icons

resource_files = $(shell $(GLIB_COMPILE_RESOURCES) --sourcedir=$(srcdir) --generate-dependencies $(srcdir)/com.evanwelsh.EmojiKeyboard.data.gresource.xml)
com.evanwelsh.EmojiKeyboard.data.gresource: com.evanwelsh.EmojiKeyboard.data.gresource.xml $(resource_files)
	$(AM_V_GEN) $(GLIB_COMPILE_RESOURCES) --target=$@ --sourcedir=$(srcdir) $<

resourcedir = $(pkgdatadir)
resource_DATA = com.evanwelsh.EmojiKeyboard.data.gresource

appsdir = $(datadir)/applications
apps_DATA = com.evanwelsh.EmojiKeyboard.desktop

@INTLTOOL_DESKTOP_RULE@

gsettings_SCHEMAS = com.evanwelsh.EmojiKeyboard.gschema.xml

@GSETTINGS_RULES@

appdatadir = $(datadir)/appdata
appdata_DATA = com.evanwelsh.EmojiKeyboard.appdata.xml

@INTLTOOL_XML_RULE@

com.evanwelsh.EmojiKeyboard.service: com.evanwelsh.EmojiKeyboard.service.in
	$(AM_V_GEN) sed \
		-e "s|[@]pkgdatadir@|$(pkgdatadir)|g" \
		-e "s|[@]pkglibdir@|$(pkglibdir)|g" \
		-e "s|[@]bindir@|$(bindir)|g" \
		$< > $@

servicedir = $(datadir)/dbus-1/services
service_DATA = com.evanwelsh.EmojiKeyboard.service

EXTRA_DIST = \
	com.evanwelsh.EmojiKeyboard.desktop.in \
	com.evanwelsh.EmojiKeyboard.service.in \
	com.evanwelsh.EmojiKeyboard.data.gresource.xml \
	$(gsettings_SCHEMAS) \
	com.evanwelsh.EmojiKeyboard.appdata.xml.in \
	$(resource_files)

CLEANFILES = \
	com.evanwelsh.EmojiKeyboard.service \
	com.evanwelsh.EmojiKeyboard.data.gresource \
	com.evanwelsh.EmojiKeyboard.appdata.xml \
	$(apps_DATA) \
	*.valid \
	gschemas.compiled

# For uninstalled use
all-local:
	$(GLIB_COMPILE_SCHEMAS) $(builddir)

-include $(top_srcdir)/git.mk
