import { Routes } from '@angular/router';
import { TabsPage } from './MainPages/tabs/tabs.page';
import { authGuard } from './guards/auth-guard-guard';
import { authRedirectGuard } from './guards/auth-redirect-guard-guard';

export const routes: Routes = [

  // Auth pages (redirect logged-in users)
  {
    path: '',
    loadComponent: () => import('./auth/welcome.page').then(m => m.AuthPage),
    canActivate: [authRedirectGuard]
  },
  {
    path: 'welcome',
    loadComponent: () => import('./auth/welcome.page').then(m => m.AuthPage),
    canActivate: [authRedirectGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage),
    canActivate: [authRedirectGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.page').then(m => m.RegisterPage),
    canActivate: [authRedirectGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/forgotPass/forgot-pass.page').then(m => m.ForgotPasswordPage),
    canActivate: [authRedirectGuard]
  },

  // Main app pages (require login)
  {
    path: 'home',
    loadComponent: () => import('./MainPages/home/home.page').then(m => m.HomePage),
   // canActivate: [authGuard]
  },
  {
    path: 'history',
    loadComponent: () => import('./MainPages/history/history.page').then(m => m.HistoryPage),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./MainPages/profile/profile.page').then(m => m.ProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'scan-item',
    loadComponent: () => import('./scan-item/scan-item.page').then(m => m.ScanItemPage),
    canActivate: [authGuard]
  },
  {
    path: 'item/:barcode',
    loadComponent: () => import('./item-detailes/item-detailes.page').then(m => m.ItemDetailesPage),
    canActivate: [authGuard]
  },
  {
    path: 'new-item',
    loadComponent: () => import('./new-item/new-item.page').then(m => m.NewItemPage),
    canActivate: [authGuard]
  },

  // Tabs section
  {
    path: 'tabs',
    component: TabsPage,
   // canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./MainPages/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'history',
        loadComponent: () => import('./MainPages/history/history.page').then(m => m.HistoryPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./MainPages/profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: 'edit-item',
    loadComponent: () => import('./edit-item/edit-item.page').then( m => m.EditItemPage),
    canActivate: [authGuard]

  }

];
