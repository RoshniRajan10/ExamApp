import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UsersComponent, AddTopicComponent } from './components'
import { UsersRoutingModule } from './users-routing.module'
import { NgxSpinnerModule } from 'ngx-spinner'
import { NgxPaginationModule } from 'ngx-pagination'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { SharedModule } from '@app/shared';
import { NgSelect2Module } from 'ng-select2';


@NgModule({
  declarations: [UsersComponent, AddTopicComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgSelect2Module,
  ],
})
export class UsersModule {}
