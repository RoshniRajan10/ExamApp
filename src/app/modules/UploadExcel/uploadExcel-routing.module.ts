import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { AddExcelFileComponent } from './components'

const routes: Routes = [{ path: '', component: AddExcelFileComponent }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadExcelRoutingModule {}
