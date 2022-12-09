import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { ListFaqComponent } from './components'

const routes: Routes = [{ path: '', component: ListFaqComponent }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListFaqRoutingModule {}
