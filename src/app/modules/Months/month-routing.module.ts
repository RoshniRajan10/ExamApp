import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { MonthComponent } from './components'

const routes: Routes = [{ path: '', component: MonthComponent }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonthRoutingModule {}
