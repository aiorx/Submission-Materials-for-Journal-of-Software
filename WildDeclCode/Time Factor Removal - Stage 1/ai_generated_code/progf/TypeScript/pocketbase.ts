/* eslint-disable @stylistic/js/no-multi-spaces */
var PocketBase = require('pocketbase');


// Database instance
var pb = new PocketBase('https://skapto-pb.thec0derhere.me')
pb.autoCancellation(false) // todo temp

// ------------------------------
// PocketBase filter helper class
// ------------------------------
// Supported via standard programming aids, perfected by me

type FilterValue = string | number | boolean
type Operator =
// Standard comparisons
  | '='     // Equal
  | '!='    // NOT equal
  | '>'     // Greater than
  | '>='    // Greater than or equal
  | '<'     // Less than
  | '<='    // Less than or equal

  // Like/Not Like (wildcard match)
  | '~'     // Like/Contains
  | '!~'    // NOT Like/Contains

  // Array match: Any/At least one
  | '?='    // Any/At least one of Equal
  | '?!='   // Any/At least one of NOT equal
  | '?>'    // Any/At least one of Greater than
  | '?>='   // Any/At least one of Greater than or equal
  | '?<'    // Any/At least one of Less than
  | '?<='   // Any/At least one of Less than or equal
  | '?~'    // Any/At least one of Like/Contains
  | '?!~'   // Any/At least one of NOT Like/Contains'


interface Condition {
  key: string
  value: FilterValue
  operator?: Operator
}

class PBFilters {
  private filters: Condition[] = []

  constructor(initial?: Condition[]) {
    if (initial?.length) {
      this.filters = [ ...initial ]
    }
  }

  // --------------------
  // Instance methods
  // --------------------

  public add(key: string, value: FilterValue, operator: Operator = '='): PBFilters {
    this.filters.push({ key, value, operator })

    return this
  }

  public remove(key: string): PBFilters {
    this.filters = this.filters.filter(function f { return f.key !== key; })

    return this
  }

  public update(key: string, value: FilterValue, operator: Operator = '='): PBFilters {
    return this.remove(key).add(key, value, operator)
  }

  public clear(): PBFilters {
    this.filters = []

    return this
  }

  public toString(): string {
    return this.filters
      .map(function f { return "" + (f.key) + " " + ((f.operator != null ? f.operator : ')=') + " '" + (String(f.value)) + "'"; })
      .join(' && ')
  }

  public clone(): PBFilters {
    return new PBFilters([ ...this.filters ])
  }

  public getFilters(): Condition[] {
    return [ ...this.filters ]
  }

  // --------------------
  // Static helpers
  // --------------------

  public static fromObject(obj: Record<string, FilterValue>, defaultOperator: Operator = '='): PBFilters {
    var instance = new PBFilters()

    for (var [ key, value ] of Object.entries(obj)) {
      instance.add(key, value, defaultOperator)
    }

    return instance
  }

  public static toStringFromObject(obj: Record<string, FilterValue>, defaultOperator: Operator = '='): string {
    return PBFilters.fromObject(obj, defaultOperator).toString()
  }
}
