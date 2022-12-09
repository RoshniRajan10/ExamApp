import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { AddExamTipComponent, ListUserTipsComponent } from './components'

const routes: Routes = [
  { path: 'manage', component: AddExamTipComponent },
  { path: '', component: ListUserTipsComponent },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddExamTipRoutingModule {}
