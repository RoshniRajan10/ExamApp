import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthComponent } from './pages/auth/auth.component'
import { AuthRoutingModule } from './auth-routing.module'
import { ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule],
})
export class AuthModule {}
