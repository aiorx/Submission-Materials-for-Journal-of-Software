function parseFilters(filterString, filterType) {
    /**
     * Penned via basic programming aids4.0 with only light edits - BLL
     * Parses a filter string into an array of filter objects.
     * Handles parentheses, nested groups, and default joins (`and`/`or`).
     */

    // Helper to parse a single filter
    function parsePrimitiveFilter(filter) {
        const match = filter.match(/(\w+(?:\.\w+)*)\s+(is not|is greater than or equal to|>=|is less than or equal to|<=|is greater than|>|is less than|<|contains|does not contain|is in|is not in|is|matches any item in label|matches every item in label)\s+(.+)/);
        if (!match) throw new Error(`Invalid filter: ${filter}`);
        const [, column_id, operator, value] = match;
        return {
            column_id: getColumnId(column_id, filterType),
            ...(operator !== "is" ? { operator } : {}),
            value: parsePrimitive(value),
        };
    }

    // Helper to parse groups (nested filters)
    function parseNestedFilters(str) {
        const stack = [];
        let current = { join: "and", filters: [] };
        let buffer = "";

        for (let i = 0; i < str.length; i++) {
            const char = str[i];

            if (char === "(") {
                if (buffer.trim()) {
                    current.filters.push(parsePrimitiveFilter(buffer.trim()));
                    buffer = "";
                }
                const newGroup = { join: "and", filters: [] };
                stack.push(current);
                current = newGroup;
            } else if (char === ")") {
                if (buffer.trim()) {
                    current.filters.push(parsePrimitiveFilter(buffer.trim()));
                    buffer = "";
                }
                const completedGroup = current;
                current = stack.pop();
                current.filters.push(completedGroup);
            } else if (str.slice(i, i + 4).toLowerCase() === " and") {
                if (buffer.trim()) {
                    current.filters.push(parsePrimitiveFilter(buffer.trim()));
                    buffer = "";
                }
                current.join = "and";
                i += 3;
            } else if (str.slice(i, i + 3).toLowerCase() === " or") {
                if (buffer.trim()) {
                    current.filters.push(parsePrimitiveFilter(buffer.trim()));
                    buffer = "";
                }
                current.join = "or";
                i += 2;
            } else {
                buffer += char;
            }
        }

        if (buffer.trim()) {
            current.filters.push(parsePrimitiveFilter(buffer.trim()));
        }

        // Simplify if the group only contains a single filter
        return current.filters.length === 1 && current.filters[0].join
            ? current.filters[0]
            : current;
    }

    // Main logic
    filterString = filterString.trim();

    if (filterString.startsWith("(")) {
        // Parse the entire input as a grouped filter
        const parsedGroup = parseNestedFilters(filterString);
        return [parsedGroup];
    }

    // Parse as a flat list of filters
    const flatFilters = filterString.split(" and ").map(filter => parsePrimitiveFilter(filter.trim()));
    return flatFilters;
}