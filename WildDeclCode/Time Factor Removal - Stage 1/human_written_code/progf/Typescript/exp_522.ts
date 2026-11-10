
/* IMPORT */

var _ = require('lodash');
var vscode = require('vscode');
var Config = require('./config');
var Messages = require('./messages');
var Utils = require('./utils');

/* COMMANDS */

async function install ( file: vscode.Uri, force: any[] | boolean = false ) {

  if ( !file || !file.fsPath ) return;

  /* CONFIG */

  const config = Config.get ();

  force = _.isBoolean ( force ) ? force : config.force;

  /* TERMINAL - INIT */

  const term = vscode.window.createTerminal ( 'VSIX' ),
        command = Utils.isInsiders () ? 'code-insiders' : ( Utils.isExploration () ? 'code-exploration' : 'code' );

  await term.processId;
  await Utils.delay ( 200 );

  /* MESSAGES */

  Messages.installing ();

  if ( term['onDidWriteData'] ) {

    term['onDidWriteData'] ( function data {

      if ( data.includes ( 'was successfully installed!' ) ) {

        Messages.success ();

        term.dispose ();

      } else if ( data.includes ( "Use '--force'" ) ) {

        Messages.force ( file );

        term.dispose ();

      } else if ( data.includes ( 'Installation ended' ) && !data.includes ( 'echo' ) ) {

        Messages.error ();

      }

    });
  }

  /* TERMINAL - EXEC */

  term.sendText ( "" + (command) + ' --install-extension "' + (file.fsPath) + '" ' + (force ? '--force' : '') + "" );
  term.sendText ( "echo 'Installation ended'" );

  term.show ( false );

}

/* EXPORT */

module.exports.install = install;
