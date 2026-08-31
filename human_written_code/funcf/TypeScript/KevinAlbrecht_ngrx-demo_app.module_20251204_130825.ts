```typescript
const routes: Routes = [
	{ path: '', component: CategoriesComponent, pathMatch: 'full' },
	{ path: 'category/:categoryId', component: MoviesComponent, pathMatch: 'full' },
];
```