import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { AdminPageComponent } from './features/admin/pages/admin/admin-page.component';
import { ChatPageComponent } from './features/chat/pages/chat/chat-page.component';
import { DepartmentsPageComponent } from './features/departments/pages/departments/departments-page.component';
import { DocumentsPageComponent } from './features/documents/pages/documents/documents-page.component';
import { FaqPageComponent } from './features/faq/pages/faq/faq-page.component';
import { HomePageComponent } from './features/home/pages/home/home-page.component';
import { LoginPageComponent } from './features/auth/pages/login/login-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomePageComponent },
  { path: 'chat', component: ChatPageComponent },
  { path: 'documents', component: DocumentsPageComponent },
  { path: 'faq', component: FaqPageComponent },
  { path: 'departments', component: DepartmentsPageComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'staff',
    component: AdminPageComponent,
    canActivate: [adminGuard],
    data: { roleView: 'staff', roles: ['staff', 'admin'] }
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [adminGuard],
    data: { roleView: 'admin', roles: ['admin'] }
  },
  { path: '**', redirectTo: 'home' }
];
