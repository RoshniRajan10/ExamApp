import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { ContentReviewComponent } from './components'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { ContentReviewRoutingModule } from './ContenReview-routing.module'
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor'
import { SharedModule } from '@app/shared';
import { ErrorDetaildViewComponent } from './components/error-detaild-view/error-detaild-view.component'
@NgModule({
  declarations: [ContentReviewComponent, ErrorDetaildViewComponent],
  imports: [
    CommonModule,
    ContentReviewRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    RichTextEditorAllModule,
    SharedModule,
  ],
})
export class ContentReviewModule {}
