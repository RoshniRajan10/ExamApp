import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { ChaptersComponent } from './components'
import { ChaptersRoutingModule } from './chapters-routing.module'
import { SharedModule } from '@app/shared';
import { 
  AddContentsComponent,
  AddPracticesComponent 
} from './components';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgSelect2Module } from 'ng-select2';
import { AddStudymaterialsComponent } from './components/chapters/add-studymaterials/add-studymaterials.component';
@NgModule({
  declarations: [ChaptersComponent, AddContentsComponent, AddPracticesComponent, AddStudymaterialsComponent],
  imports: [
    CommonModule,
    ChaptersRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    SharedModule,
    MatAutocompleteModule,
    NgSelect2Module
  ],
})
export class ChaptersModule {}
