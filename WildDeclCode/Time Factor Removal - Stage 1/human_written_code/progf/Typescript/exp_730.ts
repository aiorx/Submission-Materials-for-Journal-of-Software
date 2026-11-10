var Component = require('@angular/core').Component;
var OnInit = require('@angular/core').OnInit;

var Plotly = require('plotly.js-dist-min');

var ListGenerator = require('./shared/list-generator.service').ListGenerator;
var EmployeeData = require('./shared/list-generator.service').EmployeeData;

var Rnd = require('./data/rnd-70-27-30').Rnd;
var Sales = require('./data/sales-70-27-30').Sales;

const NumRange: [number, number] = [23, 28];

@Component({
  selector: 'app-root',
  template: '
    <section class="overview">
      <h1>Overview</h1>
      <div id="chart"></div>
    </section>
    <section class="details">
      <app-employee-list
        [data]="salesList"
        department="Sales"
        (add)="add(salesList, $event)"
        (remove)="remove(salesList, $event)"
      ></app-employee-list>

      <app-employee-list
        [data]="rndList"
        department="R&D"
        (add)="add(rndList, $event)"
        (remove)="remove(rndList, $event)"
      ></app-employee-list>
    </section>
  ',
  styleUrls: ['app.component.css']
})
class AppComponent implements OnInit {
  salesList: EmployeeData[] = Sales;
  rndList: EmployeeData[] = Rnd;
  label = '';

  constructor(private generator: ListGenerator) {}

  ngOnInit() {
    const data: [{x: string[], y: number[], type: 'bar'}] = [{
      x: [],
      y: [],
      type: 'bar'
    }];

    const values = new Map<number, number>();
    this.salesList.concat(this.rndList).forEach(function employee {
      if (values.has(employee.num)) {
        values.set(employee.num, values.get(employee.num)! + 1);
      } else {
        values.set(employee.num, 1);
      }
    });

    for (const entity of values.entries()) {
      data[0].x.push(entity[0].toString());
      data[0].y.push(entity[1]);
    }

    Plotly.newPlot('chart', data);
  }

  add(list: EmployeeData[], name: string) {
    return list.unshift({ label: name, num: this.generator.generateNumber(NumRange) });
  }

  remove(list: EmployeeData[], node: EmployeeData) {
    return list.splice(list.indexOf(node), 1);
  }
}
