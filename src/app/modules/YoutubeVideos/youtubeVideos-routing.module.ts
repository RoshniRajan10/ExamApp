import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { VideosComponent, ListVideosComponent, EditVideosComponent } from './components'

const routes: Routes = [
  { path: 'manage', component: VideosComponent },
  { path: '', component: ListVideosComponent },
  { path: 'edit', component: EditVideosComponent },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YoutubeVideoRoutingModule {}
