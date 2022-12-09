import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { ListUserTipsComponent } from './components/list-user-tips/list-user-tips.component'
import { ListUserTipsRoutingModule } from './listUserTips-routing.module'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
@NgModule({
  declarations: [ListUserTipsComponent],
  imports: [
    CommonModule,
    ListUserTipsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
  ],
})
export class ListUserTipsModule {}
