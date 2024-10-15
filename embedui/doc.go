/*
Package embedui has a single exported function Assets which returns a read-only
file system containing static build files of Annex UI.

The intended use of the file system is to serve the static UI from a Go http
server for local development only.
*/
package embedui
