import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import {ContentReviewComponent} from './components'

const routes: Routes = [
  { path: '', component: ContentReviewComponent },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentReviewRoutingModule {}
