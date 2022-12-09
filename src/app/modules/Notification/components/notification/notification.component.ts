import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { PushNotificationService, ToastMessageService } from '@app/core'
import { APP_MESSAGE } from '@app/core/config'
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  notificationForm: any
  Result: any
  submitted: boolean
  constructor(
    public formbuilder: FormBuilder,
    public pushNotificationService: PushNotificationService,
    private toastr: ToastMessageService
  ) {
    this.setNotificationForm()
  }

  ngOnInit() {}
  setNotificationForm() {
    this.notificationForm = this.formbuilder.group({
      title: ['', Validators.required],
      message: ['', Validators.required]
    })
  }

  get notificationform() {
    return this.notificationForm.controls
  }
  // function to send notification message
  sendNotification() {
    this.submitted = true
    if(this.submitted ===  true){
      const notificationtitle = this.notificationForm.value.title.trim();
      const notificationmessage = this.notificationForm.value.message.trim();
      if (notificationtitle !== '' && notificationmessage !== '') {
        this.Result = this.pushNotificationService.sendNotification(
          notificationtitle,
          notificationmessage,
          {},
          ''
        )
        if (this.Result) {
          this.submitted = false
          this.toastr.show(APP_MESSAGE.NOTIFICATION.notification_send, false);
          this.notificationForm.reset()
        } else {
          this.toastr.show(APP_MESSAGE.NOTIFICATION.notification_error);
          return false
        }
      } else {
        this.toastr.show('Title and Message fields can not be empty', true);
        return false;
      }
    }
  }
}
