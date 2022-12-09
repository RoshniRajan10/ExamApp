import { Injectable } from '@angular/core'
import { ToastrService } from 'ngx-toastr'

@Injectable({
  providedIn: 'root',
})
export class ToastMessageService {
  constructor(private toastrService: ToastrService) {}
  show(message: string, isError: boolean = true) {
    if (isError) {
      this.toastrService.error(message)
    } else {
      this.toastrService.success(message)
    }
  }
}
