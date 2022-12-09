import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { UsersandrolesComponent } from './components'

const routes: Routes = [
  { path: '', component: UsersandrolesComponent }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersandrolesRoutingModule {}
