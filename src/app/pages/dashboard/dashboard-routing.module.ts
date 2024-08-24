import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'business-owner',
        loadChildren: () =>
          import('../../pages/business-owner/business-owner.module').then(
            (m) => m.BusinessOwnerPageModule
          ),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('../../pages/payments/payments.module').then(
            (m) => m.PaymentsPageModule
          ),
      },
      {
        path: 'commerces',
        loadChildren: () =>
          import('../../pages/commerces/commerces.module').then(
            (m) => m.CommercesPageModule
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('../../pages/categories/categories.module').then(
            (m) => m.CategoriesPageModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('../../pages/products/products.module').then(
            (m) => m.ProductsPageModule
          ),
      },
      {
        path: 'details',
        loadChildren: () =>
          import('../../pages/details/details.module').then(
            (m) => m.DetailsPageModule
          ),
      },
      {
        path: 'villes-commerces',
        loadChildren: () =>
          import('../../pages/villes-commerces/villes-commerces.module').then(
            (m) => m.VillesCommercesPageModule
          ),
      },
      {
        path: '',
        redirectTo: 'business-owner',
        pathMatch: 'full',
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
