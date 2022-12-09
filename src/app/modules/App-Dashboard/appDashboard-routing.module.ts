import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { AppDashboardComponent, DashboardVideosComponent } from './components'

const routes: Routes = [
  { path: '', component: AppDashboardComponent },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppDashboardRoutingModule {}
