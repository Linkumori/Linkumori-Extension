# Makefile for converting UFO files to TTF format

# Default target
all: mfb-oldstyle-regular

# Convert MFB Oldstyle Regular
mfb-oldstyle-regular:
	fontmake -u "MFB Oldstyle-Regular.ufo" -o ttf --output-dir .

# Clean generated TTF files
clean:
	rm -f *.ttf

# Rebuild all fonts
rebuild: clean all

# Show available targets
help:
	@echo "Available targets:"
	@echo "  all      - Build all TTF fonts from UFO files"
	@echo "  clean    - Remove generated TTF files"
	@echo "  rebuild  - Clean and rebuild all fonts"
	@echo "  help     - Show this help message"
	@echo ""
	@echo "UFO files found: $(UFO_FILES)"
	@echo "TTF files to generate: $(TTF_FILES)"

.PHONY: all clean rebuild help