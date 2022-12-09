import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor'
import { Ng5SliderModule } from 'ng5-slider'
import { UsersandrolesRoutingModule } from './Usersandroles-routing.module'
import { SharedModule } from '@app/shared';
import { 
  UsersandrolesComponent,
  AdduserComponent,
  EdituserComponent
} from './components'

@NgModule({
  declarations: [UsersandrolesComponent, AdduserComponent, EdituserComponent],
  imports: [
    CommonModule,
    UsersandrolesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    RichTextEditorAllModule,
    Ng5SliderModule,
    SharedModule
  ],
})
export class UsersandrolesModule {}
