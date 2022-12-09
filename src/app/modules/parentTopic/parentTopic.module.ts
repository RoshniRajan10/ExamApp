import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { ParentTopicComponent } from './components'
import { ParentTopicRoutingModule } from './parentTopic-routing.module'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { SharedModule } from '@app/shared'
@NgModule({
  declarations: [ParentTopicComponent],
  imports: [
    CommonModule,
    SharedModule,
    ParentTopicRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
  ],
})
export class ParentTopicModule {}
