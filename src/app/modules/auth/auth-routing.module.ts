import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { AuthComponent } from './pages/auth/auth.component'

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'auth', component: AuthComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
