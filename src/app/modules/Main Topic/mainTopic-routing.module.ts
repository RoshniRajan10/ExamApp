import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { MainTopicComponent } from './components'

const routes: Routes = [{ path: '', component: MainTopicComponent }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainTopicRoutingModule {}
