import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { AddFaqComponent } from './components'

const routes: Routes = [{ path: '', component: AddFaqComponent }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddFaqRoutingModule {}
