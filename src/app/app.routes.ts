import { Routes } from '@angular/router';
import { adminGuard } from './services/admin.guard';
import { AdminPageComponent } from './pages/admin/admin-page.component';
import { ChatPageComponent } from './pages/chat/chat-page.component';
import { DepartmentsPageComponent } from './pages/departments/departments-page.component';
import { DocumentsPageComponent } from './pages/documents/documents-page.component';
import { FaqPageComponent } from './pages/faq/faq-page.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';

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
