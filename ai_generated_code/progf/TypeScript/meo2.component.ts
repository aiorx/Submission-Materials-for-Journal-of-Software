import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioAppConfig, FormioService } from '@formio/angular';
import {
  debounceTime,
  filter,
  switchMap,
  takeUntil,
  map,
} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DinetFormioForm } from '../../dinet_common';
import { FormioServiceFactoryService } from '../../formio-service-factory.service';

/** This component Built using basic development resources-5, original component for meo2.component.ts */

@Component({
  selector: 'app-meo2',
  templateUrl: './meo2.component.html',
  styleUrls: ['./meo2.component.scss'],
})
export class Meo2Component implements OnInit, OnDestroy {
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

    localStorage.setItem('prod_no', result.productNo ?? '');
    localStorage.setItem('lot_no', result.lot ?? '');
    localStorage.setItem('initial_quantity', result.initialQuantity ?? '');

    this.FindStep(form);
  }

  /** Megkeresi a következő lépést a termék nevéből */
  FindStep(form: DinetFormioForm) {
    const name = localStorage.getItem('prod_no');
    if (!name) return;

    const query = {
      params: {
        name__regex: `/${name}/i`,
        tags__eq: ['common'],
        type: 'form',
      },
    };

    this.formService
      .loadForms(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          const dinetResults = (results as DinetFormioForm[]).sort((a, b) =>
            (a.name ?? '').localeCompare(b.name ?? '', undefined, {
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
        error: (e) => {
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
        next: (results) => {
          const lotForms = results as DinetFormioForm[];
          if (lotForms.length > 0) {
            const lotId = lotForms[0]._id ?? '';
            this.lotUrl = `${this.appConfig.appUrl}/form/${lotId}/submission`;
            //this.lotFormService = new FormioService(this.lotUrl);
            this.lotFormService = this.formioFactory.create(this.lotUrl); // ✅ no `new`
          }
        },
        error: (e) => {
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
        filter((value) => value?.length > 1),
        map((value) => value.trim()),
        switchMap((value) =>
          this.lotFormService.loadSubmissions({
            params: {
              'data.lot__regex': `/${value}/i`,
              'data.inProduction': 'true',
            },
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((results) => {
        this.userDisplayResults = results as DinetFormioForm[];
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
