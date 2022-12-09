import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { NotificationComponent } from './components'

const routes: Routes = [{ path: '', component: NotificationComponent }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationRoutingModule {}
