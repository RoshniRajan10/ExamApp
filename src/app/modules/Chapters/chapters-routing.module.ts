import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { ChaptersComponent, AddContentsComponent } from './components'

const routes: Routes = [
  { path: '', component: ChaptersComponent },
  { path: 'add-contents', component: AddContentsComponent }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChaptersRoutingModule {}
