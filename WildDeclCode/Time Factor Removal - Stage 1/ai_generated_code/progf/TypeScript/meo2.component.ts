var Component = require('@angular/core').Component;
var OnDestroy = require('@angular/core').OnDestroy;
var OnInit = require('@angular/core').OnInit;
var FormBuilder = require('@angular/forms').FormBuilder;
var FormGroup = require('@angular/forms').FormGroup;
var Router = require('@angular/router').Router;
var ActivatedRoute = require('@angular/router').ActivatedRoute;
var FormioAppConfig = require('@formio/angular').FormioAppConfig;
var FormioService = require('@formio/angular').FormioService;
import {
  debounceTime,
  filter,
  switchMap,
  takeUntil,
  map,
} from 'rxjs/operators';
var Subject = require('rxjs').Subject;
var DinetFormioForm = require('../../dinet_common').DinetFormioForm;
var FormioServiceFactoryService = require('../../formio-service-factory.service').FormioServiceFactoryService;

/** This component Built using basic development resources-5, original component for meo2.component.ts */

@Component({
  selector: 'app-meo2',
  templateUrl: './meo2.component.html',
  styleUrls: ['./meo2.component.scss'],
})
class Meo2Component implements OnInit, OnDestroy {
  url = this.appConfig.appUrl;
  lotUrl = this.appConfig.appUrl; // URL a lot formhoz

  userDisplayResults: DinetFormioForm[] = [];
  searchForm!: FormGroup;

  //private formService = new FormioService(this.url);
  //private lotFormService = new FormioService(this.url);
  private formService: FormioService;
  private lotFormService: FormioService;

  private destroy$ = new Subject<void>();

  private readonly lotQuery = {
    params: {
      name__eq: 'lot',
      type: 'resource',
    },
  };

  constructor(
    public appConfig: FormioAppConfig,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private formioFactory: FormioServiceFactoryService
  ) {
    this.formService = this.formioFactory.create(this.url);
    this.lotFormService = this.formioFactory.create(this.lotUrl);
  }

  /** Ha egy sorra kattintanak, elmentjük a szükséges adatokat és betöltjük a lépést */
  ClickedRow(i: number, form: DinetFormioForm) {
    const result = this.userDisplayResults[i]?.data;
    if (!result) return;

    localStorage.setItem('prod_no', (result.productNo != null ? result.productNo : ''));
    localStorage.setItem('lot_no', (result.lot != null ? result.lot : ''));
    localStorage.setItem('initial_quantity', (result.initialQuantity != null ? result.initialQuantity : ''));

    this.FindStep(form);
  }

  /** Megkeresi a következő lépést a termék nevéből */
  FindStep(form: DinetFormioForm) {
    const name = localStorage.getItem('prod_no');
    if (!name) return;

    const query = {
      params: {
        name__regex: "/" + (name) + "/i",
        tags__eq: ['common'],
        type: 'form',
      },
    };

    this.formService
      .loadForms(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: function (results) {
          const dinetResults = (results as DinetFormioForm[]).sort((a, b) =>
            ((a.name != null ? a.name : '')).localeCompare((b.name != null ? b.name : ''), undefined, {
              sensitivity: 'base',
            })
          );

          localStorage.setItem('forms', JSON.stringify(dinetResults));

          if (dinetResults.length > 0) {
            this.router.navigate(['step', dinetResults[0]._id], {
              relativeTo: this.route,
            });
          } else {
            alert('No Product found!'); // TODO: snackbar ajánlott
          }
        },
        error: function (e) {
          console.error(e);
          alert('Error loading forms: ' + e); // TODO: snackbar ajánlott
        },
      });
  }

  ngOnInit() {
    // Lot form betöltés
    this.lotFormService
      .loadForms(this.lotQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: function (results) {
          const lotForms = results as DinetFormioForm[];
          if (lotForms.length > 0) {
            const lotId = (lotForms[0]._id != null ? lotForms[0]._id : '');
            this.lotUrl = "" + (this.appConfig.appUrl) + "/form/" + (lotId) + "/submission";
            //this.lotFormService = new FormioService(this.lotUrl);
            this.lotFormService = this.formioFactory.create(this.lotUrl); // ✅ no `new`
          }
        },
        error: function (e) {
          alert('Error loading forms: ' + e);
        },
      });

    // Kereső form
    this.searchForm = this.fb.group({ lot: [''] });
    localStorage.removeItem('forms');

    this.searchForm
      .get('lot')!
      .valueChanges.pipe(
        debounceTime(400),
        filter(function (value) { return value?.length > 1; }),
        map(function (value) { return value.trim(); }),
        switchMap(function (value) { return this.lotFormService.loadSubmissions({
            params: {
              'data.lot__regex': "/" + (value) + "/i",
              'data.inProduction': 'true',
            },
          }); }),
        takeUntil(this.destroy$)
      )
      .subscribe(function (results) {
        this.userDisplayResults = results as DinetFormioForm[];
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
