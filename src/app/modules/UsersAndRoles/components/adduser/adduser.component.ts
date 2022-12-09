import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersandrolesService } from '@app/core/services'
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {
  @Output() addUserEmiter = new EventEmitter<{actionAddUser: boolean, pageNo: number}>();
  @Input() addUserItems: any;
  addUserForm: FormGroup;
  submitted: boolean;
  constructor(
    public formBuilder: FormBuilder,
    public usersandrolesService: UsersandrolesService
  ) { }

  ngOnInit(): void {
    this.setaddUserForm();
  }
  // set add user form
  setaddUserForm(){
    this.addUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      // password: ['', Validators.required],
      userlevel: ['']
    })
  }
  // go back to user list
  back(){
    this.addUserEmiter.emit({actionAddUser:false, pageNo: this.addUserItems.pageNo});
  }
  // get constrols add user form
  get adduserform() {
    return this.addUserForm.controls
  }
  // save user details
  saveUser(){
    this.submitted = true;
    if(this.addUserForm.valid && this.submitted === true){
      let userLevel = "3";
      if(this.addUserForm.value.userlevel !== ''){
        userLevel = this.addUserForm.value.userlevel
      }
      const userDetails = {
        name: this.addUserForm.value.name,
        email: this.addUserForm.value.email,
        // password: this.addUserForm.value.password,
        userLevel: userLevel,
        permissionSet:""
      }
      const insert = this.usersandrolesService.addUserDetails(userDetails)
      if(insert){
        this.addUserEmiter.emit({actionAddUser:false, pageNo: this.addUserItems.pageNo});
      }
    } else {
      this.submitted = true
    }
  }
}
