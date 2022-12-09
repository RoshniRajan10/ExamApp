import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { SubTopicRoutingModule } from './subTopic-routing.module'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { SubTopicComponent } from './components'
import { SharedModule } from '@app/shared'
@NgModule({
  declarations: [SubTopicComponent],
  imports: [
    CommonModule,
    SubTopicRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    SharedModule,
  ],
})
export class SubTopicModule {}
