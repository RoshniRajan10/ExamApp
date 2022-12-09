import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { CommonPublishService, PushNotificationService, ToastMessageService } from '@app/core'
import { APP_MESSAGE } from '@app/core/config'
declare var $: any

@Component({
  selector: 'app-common-publish',
  templateUrl: './common-publish.component.html',
  styleUrls: ['./common-publish.component.scss'],
})
export class CommonPublishComponent implements OnInit {
  @Input() item: any
  sectionid: any
  notificationForm: any;
  msgtitle: boolean
  notification = true;
  submitted: boolean;
  checked = false;
  constructor(
    private commonPublishService: CommonPublishService,    
    public formbuilder: FormBuilder,
    public pushNotificationService: PushNotificationService,
    private toastr: ToastMessageService,
  ) {
    this.setNotificationForm();
  }

  ngOnInit(): void {}
  // function to initialize notification form
  setNotificationForm() {
    this.notificationForm = this.formbuilder.group({
      noti_check: [''],
      notificationtitle: [''],
      notificationmessage: ['']
    })
  }
  get notificationform() {
    return this.notificationForm.controls
  }
  updatePublishItem(section, sectionItems) {
    this.sectionid = section.key;
    const key = sectionItems.key;
    const details = sectionItems.details;
    const type = sectionItems.type;
    let notTitle = "";
    let notMessage = "";
    if(this.notificationForm.value.notificationtitle !== null){
      notTitle = this.notificationForm.value.notificationtitle.trim();
    }
    if(this.notificationForm.value.notificationmessage !== null){
      notMessage = this.notificationForm.value.notificationmessage.trim();
    }
    const notificationtitle = notTitle;
    const notificationmessage = notMessage;
    if ((this.msgtitle === true) && (notificationtitle === '' || notificationmessage === '')){
      this.toastr.show('Title and Message fields can not be empty, notification is not send', true);
      this.submitted = false;
      return false;
    } else if ((this.msgtitle === true) && (notificationtitle !== '' || notificationmessage !== '')) {
      this.submitted = true;
      const result = this.pushNotificationService.sendNotification(
        notificationtitle,
        notificationmessage,
        { key:key, type:type, details:details },
        ''
      );
      if(result){
        this.submitted = false;
        this.toastr.show(APP_MESSAGE.NOTIFICATION.notification_send, false)
      }
      this.commonPublishService.publishItem(this.sectionid, sectionItems);
    } else{
      this.commonPublishService.publishItem(this.sectionid, sectionItems);
    }
    this.notificationForm.reset();
  }
  checkNotification(event) {
    if (event.target.checked === true) {
      this.notificationForm.controls.notificationtitle.setValidators([Validators.required]);
      this.msgtitle = true;
      this.checked = true;
    } else {
      this.msgtitle = false;
      this.checked = false;
    }
  }
  cancelPublish() {
    this.notificationForm.reset();
    this.checked = false;
    this.msgtitle = false;
    $('#modal-update-publish').modal('hide')
  }
}
