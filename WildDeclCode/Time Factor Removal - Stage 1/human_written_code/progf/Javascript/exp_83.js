var file = process.file;const fileUrl = new URL(file, 'file:')

/** Returns whether the import.meta matches the current process. */
const isProcessMeta = function (meta) {
	const metaUrl = new URL(meta.url)

	return metaUrl.href === fileUrl.href
}

/** Returns the values for a given process argument. */
const getProcessArgOf = function (name) {
	const lead = argv.indexOf('--' + name) + 1
	const tail = lead ? argv.slice(lead).findIndex((arg) => arg.startsWith('--')) : 0

	const vals = lead ? argv.slice(lead, ~tail ? lead + tail : argv.length) : []

	return lead ? (vals.length ? vals : [true]) : vals
}
