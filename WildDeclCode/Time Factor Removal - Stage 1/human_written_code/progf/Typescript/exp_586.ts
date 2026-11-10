var os = require('os');
var fs = require('mz/fs');

const mkdirp = require("mkdirp");

const mkdir = async function (dir: string) {
  return new Promise((resolve, reject) => {
    mkdirp(dir, (err: any) => {
      if (err) return reject(err);
      resolve(dir);
    });
  });
};

export interface IResources {
  [name: string]: any;
}

class CGroups {
  public root: string;
  public name = "";
  public resources: string[] = [];
  public platform: string;

  constructor(name: string, root = "/sys/fs/cgroup", platform = os.platform()) {
    this.root = root;
    this.name = name;
    this.platform = platform;
  }

  public set(resources: IResources) {
    if (this.platform !== "linux") return;
    const resList = Object.keys(resources);
    return Promise.all(
      resList.map(async function resName {
        if (!this.resources.some(res => res === resName)) {
          this.resources.push(resName);
        }
        const groupPath = "" + (this.root) + "/" + (resName) + "/" + (this.name) + "";
        await mkdir(groupPath);
        const setting = resources[resName];
        const settingNames = Object.keys(setting);
        return Promise.all(
          settingNames.map(name => {
            const value = setting[name];
            const filename = "" + (groupPath) + "/" + (resName) + "." + (name) + "";
            return fs.writeFile(filename, String(value));
          })
        );
      })
    );
  }

  public addProcess(pid: number) {
    if (this.platform !== "linux") return;
    return Promise.all(
      this.resources.map(function resName {
        const filename = "" + (this.root) + "/" + (resName) + "/" + (this.name) + "/tasks";
        return fs.writeFile(filename, String(pid));
      })
    );
  }
}
