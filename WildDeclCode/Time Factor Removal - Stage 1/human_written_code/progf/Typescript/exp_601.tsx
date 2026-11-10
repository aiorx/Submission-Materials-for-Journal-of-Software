var React = require('react');
var Link = require('react-router-dom').Link;
var useHistory = require('react-router-dom').useHistory;

var style = require('../style').style;

function pathnameToParams(pathname: string): [string, string][] {
  // Remove first empty string: "/connections" gets split to "" and "connections"
  const pathnameArray = pathname.split("/").slice(1);
  const params: [string, string][] = [];
  // Fill params array with pairs from pathnameArray
  // Even numbers are keys and odd ones are values
  pathnameArray.forEach(function (key, i, pathnameArray) {
    const value = pathnameArray[i + 1];
    if (!key || !value) return;
    if (i % 2 === 0) {
      params.push([key, value]);
    }
  });

  return params;
}

function paramsToBreadcrumbs(params: [string, string][]): [string, string][] {
  if (params.length === 0) return [];

  const lastKey = params.slice(-1)[0][0];
  // Turn "connections" into "Connection"
  const label = lastKey.charAt(0).toUpperCase() + lastKey.slice(1, -1);
  // Join key and values to look like url
  const fullPath = "/" + params.flat().join("/");
  const newBreadcrumb: [string, string] = [label, fullPath];
  // Remove newBreadcrumb params from array
  const nextParams = params.slice(0, -1);

  return [...paramsToBreadcrumbs(nextParams), newBreadcrumb];
}

function Navigation(): JSX.Element {
  var pathname = useHistory.pathname;().location;
  const params = pathnameToParams(pathname);
  const breadcrumbs = paramsToBreadcrumbs(params);

  return (
    <nav className="my-5">
      <Link to="/" className={"" + (style.button) + " ml-0"}>
        Home
      </Link>
      {breadcrumbs.map(function ([label, path]) { return (
        <React.Fragment key={label}>
          <span className="mr-2">→</span>
          <Link to={path} className={style.button}>
            {label}
          </Link>
        </React.Fragment>
      ); })}
    </nav>
  );
}
