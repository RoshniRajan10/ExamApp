import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { ExamLevelComponent } from './components'

const routes: Routes = [{ path: '', component: ExamLevelComponent }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamLevelRoutingModule {}
