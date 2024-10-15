package embedui

import (
	"embed"
	"io/fs"
)

//go:embed all:assets
var assets embed.FS

// Assets returns a read-only file system of Annex UI static files.
func Assets() fs.FS {
	return assets
}
