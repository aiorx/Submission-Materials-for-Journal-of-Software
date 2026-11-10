interface IQueryResults {
  Tables: IQueryResult[]
}

interface IQueryResult {
  TableName: string,
  Columns: {
    ColumnName: string,
    DataType: string,
    ColumnType: string
  }[],
  Rows: any[][]
}

interface IQueryStatus {
  Ordinal: number,
  Kind: string,
  Name: string,
  Id: string
}

/**
 * ====================================
 * Template definitions
 * ====================================
 */

/**
 * Application Insights data source definition
 */
interface AIDataSource extends IDataSource {
  type: 'ApplicationInsights/Query',
  dependencies: {
    /**
     * Required - to use in all queries to app insights as a basic timespan parameter
     */
    queryTimespan: string,
    /**
     * Optional - from which 'queryTimespan' is derived
     */
    timespan?: string,
    /**
     * Used for queries that require granularity (like timeline)
     */
    granularity?: string
  },
  params: AIQueryParams | AIForkedQueryParams;
}

 /**
  * A simple query on application insights data source
  */
interface AIQueryParams {
  query: AIQuery,
  mappings?: AIMapping
}

/**
 * A forked query that aggregates several queries into a single API call
 */
interface AIForkedQueryParams {
  /**
   * The table on which to perform the forken query
   */
  table: string,
  queries: IDict<{
    query: AIQuery,
    mappings?: AIMapping,
    filters?: Array<IStringDictionary>,
    calculated?: function (state: any, dependencies?: any, prevState?: any) { return any; }}>,
}

type AIQuery = string | (function () { return string; }) | (function (dependencies: any) { return string; });
type AIMapping = IDict<function (value: any, row: any, idx: number) { return string | number | boolean>; };
