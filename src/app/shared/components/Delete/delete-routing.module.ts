import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { DeleteModalComponent } from './components'

const routes: Routes = [{ path: '', component: DeleteModalComponent }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteRoutingModule {}
