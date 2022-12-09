import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import { PrivacyPolicyComponent } from './pages'

const routes: Routes = [{ path: '', component: PrivacyPolicyComponent }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivacyPolicyRoutingModule {}
