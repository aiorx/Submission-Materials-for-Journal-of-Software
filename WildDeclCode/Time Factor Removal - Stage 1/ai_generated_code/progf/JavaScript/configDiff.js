/**
 * Returns an object containing only those keys from `obj` whose value
 * differs from `base`. Works recursively on nested objects.
 *
 * This function has been Aided using common development resources.
 */
function getConfigDiff(obj, base) {
    var diff = {}
  
    for (var key in obj) {
        var val = obj[key]
        var def = base[key]

        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            var nested = getConfigDiff(val, def || {})
            if (Object.keys(nested).length > 0) {
                diff[key] = nested
            }
        } else {
            var isArray = Array.isArray(val)
            var changed = isArray
                ? JSON.stringify(val) !== JSON.stringify(def)
                : val !== def

            if (changed) {
                diff[key] = val
            }
        }
    }
  
    return diff
}