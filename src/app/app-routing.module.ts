import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  /* {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  }, */
  {
    path: '',
    redirectTo: 'villes-commerces',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'verify-email/:token',
    loadChildren: () => import('./pages/verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'reset-password/:token',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'villes-commerces',
    loadChildren: () => import('./pages/villes-commerces/villes-commerces.module').then( m => m.VillesCommercesPageModule)
  },
  {
    path: 'show-commerce-categories/:commerceId',
    loadChildren: () => import('./pages/show-commerce-categories/show-commerce-categories.module').then( m => m.ShowCommerceCategoriesPageModule)
  },
  {
    path: 'show-category-products/:categoryId',
    loadChildren: () => import('./pages/show-category-products/show-category-products.module').then( m => m.ShowCategoryProductsPageModule)
  },
  {
    path: 'show-product-details/:productId',
    loadChildren: () => import('./pages/show-product-details/show-product-details.module').then( m => m.ShowProductDetailsPageModule)
  },
  {
    path: 'show-detail',
    loadChildren: () => import('./pages/show-detail/show-detail.module').then( m => m.ShowDetailPageModule)
  },
  {
    path: 'business-owner',
    loadChildren: () => import('./pages/business-owner/business-owner.module').then( m => m.BusinessOwnerPageModule)
  },
  {
    path: 'create-business-owner',
    loadChildren: () => import('./pages/create-business-owner/create-business-owner.module').then( m => m.CreateBusinessOwnerPageModule)
  },
  {
    path: 'edit-delete-business-owner',
    loadChildren: () => import('./pages/edit-delete-business-owner/edit-delete-business-owner.module').then( m => m.EditDeleteBusinessOwnerPageModule)
  },
  {
    path: 'payments',
    loadChildren: () => import('./pages/payments/payments.module').then( m => m.PaymentsPageModule)
  },
  {
    path: 'make-payments',
    loadChildren: () => import('./pages/make-payments/make-payments.module').then( m => m.MakePaymentsPageModule)
  },
  {
    path: 'renew-payments',
    loadChildren: () => import('./pages/renew-payments/renew-payments.module').then( m => m.RenewPaymentsPageModule)
  },
  {
    path: 'commerces',
    loadChildren: () => import('./pages/commerces/commerces.module').then( m => m.CommercesPageModule)
  },
  {
    path: 'create-commerces',
    loadChildren: () => import('./pages/create-commerces/create-commerces.module').then( m => m.CreateCommercesPageModule)
  },
  {
    path: 'edit-delete-commerces',
    loadChildren: () => import('./pages/edit-delete-commerces/edit-delete-commerces.module').then( m => m.EditDeleteCommercesPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'create-categories',
    loadChildren: () => import('./pages/create-categories/create-categories.module').then( m => m.CreateCategoriesPageModule)
  },
  {
    path: 'edit-delete-categories',
    loadChildren: () => import('./pages/edit-delete-categories/edit-delete-categories.module').then( m => m.EditDeleteCategoriesPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'create-products',
    loadChildren: () => import('./pages/create-products/create-products.module').then( m => m.CreateProductsPageModule)
  },
  {
    path: 'edit-delete-products',
    loadChildren: () => import('./pages/edit-delete-products/edit-delete-products.module').then( m => m.EditDeleteProductsPageModule)
  },
  {
    path: 'details',
    loadChildren: () => import('./pages/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'create-details',
    loadChildren: () => import('./pages/create-details/create-details.module').then( m => m.CreateDetailsPageModule)
  },
  {
    path: 'edit-delete-details',
    loadChildren: () => import('./pages/edit-delete-details/edit-delete-details.module').then( m => m.EditDeleteDetailsPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'activities-villes',
    loadChildren: () => import('./pages/activities-villes/activities-villes.module').then( m => m.ActivitiesVillesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
