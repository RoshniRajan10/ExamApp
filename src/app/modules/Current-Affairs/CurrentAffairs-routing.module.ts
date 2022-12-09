import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import {
  ListCurrentAffairComponent,
  AddCurrentAffairsComponent,
} from './components'

const routes: Routes = [
  { path: '', component: ListCurrentAffairComponent },
  { path: 'manage', component: AddCurrentAffairsComponent },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrentAffairsRoutingModule {}
