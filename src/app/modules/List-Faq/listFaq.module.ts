import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { ListFaqComponent } from './components'
import { ListFaqRoutingModule } from './listFaq-routing.module'
import { SharedModule } from '@app/shared'
@NgModule({
  declarations: [ListFaqComponent],
  imports: [
    CommonModule,
    ListFaqRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    SharedModule,
  ],
})
export class ListFaqModule {}
