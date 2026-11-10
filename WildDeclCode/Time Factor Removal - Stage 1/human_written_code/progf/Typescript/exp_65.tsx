var Container = require('@mui/material').Container;
var CssBaseline = require('@mui/material').CssBaseline;
var Typography = require('@mui/material').Typography;
var React = require('react');

export type ErrorPageProps = {
  error: Error;
  history: History;
};

function ErrorPage(props: ErrorPageProps): JSX.Element {
  var error = props.error;

  return (
    <Container sx={{ marginTop: "43vh" }}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography
          variant="h1"
          align="center"
          sx={{
            fontSize: "2em",
            fontWeight: 300,
            "& strong": {
              fontWeight: 400,
            },
          }}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <strong>Error {(error as any).status || 500}</strong>: {error.message}
        </Typography>
      </Container>
    </Container>
  );
}
