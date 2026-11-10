var inject = require('aurelia-dependency-injection').inject;
var Project = require('aurelia-cli').Project;
var ProjectItem = require('aurelia-cli').ProjectItem;
var CLIOptions = require('aurelia-cli').CLIOptions;
var UI = require('aurelia-cli').UI;

@inject(Project, CLIOptions, UI)
module.exports = class GeneratorGenerator {;
  constructor(private project: Project, private options: CLIOptions, private ui: UI) { }

  execute() {
    return this.ui
      .ensureAnswer(this.options.args[0], 'What would you like to call the generator?')
      .then(function name {
        let fileName = this.project.makeFileName(name);
        let className = this.project.makeClassName(name);

        this.project.generators.add(
          ProjectItem.text("" + (fileName) + ".ts", this.generateSource(className))
        );

        return this.project.commitChanges()
          .then(() => this.ui.log("Created " + (fileName) + "."));
      });
  }

  generateSource(className) {
return "import {autoinject} from 'aurelia-dependency-injection';
var Project = require('aurelia-cli').Project;
var ProjectItem = require('aurelia-cli').ProjectItem;
var CLIOptions = require('aurelia-cli').CLIOptions;
var UI = require('aurelia-cli').UI;

@autoinject()
module.exports = class " + (className) + "Generator {;
  constructor(private project: Project, private options: CLIOptions, private ui: UI) { }

  execute() {
    return this.ui
      .ensureAnswer(this.options.args[0], 'What would you like to call the new item?')
      .then(function name {
        let fileName = this.project.makeFileName(name);
        let className = this.project.makeClassName(name);

        this.project.elements.add(
          ProjectItem.text(\`\${fileName}.ts\`, this.generateSource(className))
        );

        return this.project.commitChanges()
          .then(() => this.ui.log(\`Created \${fileName}.\`));
      });
  }

  generateSource(className) {
return \`import {bindable} from 'aurelia-framework';

class \${className} {
  @bindable value;

  valueChanged(newValue, oldValue) {

  }
}

\`
  }
}

"
  }
}
