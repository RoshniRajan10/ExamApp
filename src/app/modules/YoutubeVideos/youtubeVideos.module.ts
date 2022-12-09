import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { VideosComponent } from './components'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor'
import { YoutubeVideoRoutingModule } from './youtubeVideos-routing.module'
import { ListVideosComponent } from './components/list-videos/list-videos.component'
import { SharedModule } from '@app/shared'
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditVideosComponent } from './components/edit-videos/edit-videos.component'
@NgModule({
  declarations: [VideosComponent, ListVideosComponent, EditVideosComponent],
  imports: [
    CommonModule,
    YoutubeVideoRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    RichTextEditorAllModule,
    SharedModule,
    DragDropModule,
  ],
})
export class YoutubeVideoModule {}
