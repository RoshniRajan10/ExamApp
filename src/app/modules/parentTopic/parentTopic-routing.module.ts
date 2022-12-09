import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { ParentTopicComponent } from './components'

const routes: Routes = [{ path: '', component: ParentTopicComponent }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParentTopicRoutingModule {}
