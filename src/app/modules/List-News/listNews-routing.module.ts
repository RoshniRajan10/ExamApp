import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { ListNewsComponent } from './components'

const routes: Routes = [{ path: '', component: ListNewsComponent }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListNewsRoutingModule {}
