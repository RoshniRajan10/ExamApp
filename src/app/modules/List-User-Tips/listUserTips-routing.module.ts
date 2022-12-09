import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { ListUserTipsComponent } from './components'

const routes: Routes = [{ path: '', component: ListUserTipsComponent }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListUserTipsRoutingModule {}
