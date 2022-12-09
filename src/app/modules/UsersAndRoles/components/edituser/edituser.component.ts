import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersandrolesService } from '@app/core/services'

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.scss']
})
export class EdituserComponent implements OnInit {
  @Output() editUserEmiter = new EventEmitter<{actionEditUser: boolean, pageNo: number}>();
  @Input() editUserItems: any;
  editUserForm: FormGroup;
  submitted: boolean;
  constructor(
    public formBuilder: FormBuilder,
    public usersandrolesService: UsersandrolesService
  ) { }

  ngOnInit(): void {
    this.seteditUserForm();
  }
  // set add user form
  seteditUserForm(){
    this.editUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      userlevel: ['']
    })
  }
  // go back to user list
  back(){
    this.editUserEmiter.emit({actionEditUser:false, pageNo: this.editUserItems.pageNo});
  }
  // get constrols add user form
  get edituserform() {
    return this.editUserForm.controls
  }
  // save user details
  updateUser(){
    this.submitted = true;
    if(this.editUserForm.valid && this.submitted === true){
      let userLevel = "3";
      if(this.editUserForm.value.userlevel !== ''){
        userLevel = this.editUserForm.value.userlevel
      }
      const userDetails = {
        name: this.editUserForm.value.name,
        email: this.editUserForm.value.email,
        uid: this.editUserItems.userKey,
        userLevel: userLevel,
        permissionSet:""
      }
      const update = this.usersandrolesService.updateUserDetails(userDetails)
      if(update){
        this.editUserEmiter.emit({actionEditUser:false, pageNo: this.editUserItems.pageNo});
      }
    }
  }
}
