import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { AddExcelComponent } from './components'

const routes: Routes = [{ path: '', component: AddExcelComponent }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddExcelRoutingModule {}
