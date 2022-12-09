import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { UsersComponent } from './components/users/users.component'
const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'users', component: UsersComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
