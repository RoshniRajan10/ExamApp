import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { MainTopicComponent } from './components/main-topic/main-topic.component'
import { MainTopicRoutingModule } from './mainTopic-routing.module'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { SharedModule } from '@app/shared'
@NgModule({
  declarations: [MainTopicComponent],
  imports: [
    CommonModule,
    MainTopicRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    SharedModule,
  ],
})
export class MainTopicModule {}
