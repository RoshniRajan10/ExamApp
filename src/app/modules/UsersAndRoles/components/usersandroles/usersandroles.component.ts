import { Component, OnInit } from '@angular/core';
declare var $: any
import { APP_MESSAGE } from '@app/core/config'
import { UsersandrolesService } from '@app/core/services'
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
  selector: 'app-usersandroles',
  templateUrl: './usersandroles.component.html',
  styleUrls: ['./usersandroles.component.scss']
})
export class UsersandrolesComponent implements OnInit {
  noDataMsg = APP_MESSAGE.COMMON.result_not_found
  actionAddUser: boolean;
  listUser = true;
  addUserItems = {};
  editUserItems = {};
  5 = {};
  searchUser: any;
  itemsPerPage = 10;
  pageNo = 1;
  allUsers: any[];
  actionEditUser: boolean;
  constructor(
    private usersandrolesService: UsersandrolesService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }
  // get all users
  getAllUsers(){
    this.spinner.show();
    this.usersandrolesService.getAllUsers().subscribe((list)=>{
      const users = list.map((userData)=>{
        return {
          $key: userData.key,
          ...userData.payload.val(),
        }
      });
      this.spinner.hide();
      this.allUsers = users;
    })
  }
  addUser(){
    this.actionAddUser = true;
    this.listUser = false;
    this.addUserItems = {
      pageNo: this.pageNo
    }
  }
  editUser(userKey){
    this.spinner.show();
    this.usersandrolesService.getUserDetailsByKey(userKey)
    .then((snapShot)=>{
      this.spinner.hide();
      const userDetails = snapShot.val()
      this.editUserItems = {
        userKey: userKey,
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password,
        userLevel: userDetails.userLevel,
        pageNo: this.pageNo
      }
      this.actionEditUser = true;
      this.listUser = false;
    })
  }
  // Emited from add user
  emitFromAddUser(event){
    this.actionAddUser = false;
    this.listUser = true;
    this.pageNo = event.pageNo;
  }
  // Emited from edit user
  emitFromEditUser(event){
    this.actionEditUser = false;
    this.listUser = true;
    this.pageNo = event.pageNo;
  }
  //on search event
  onSearchChange(searchExam: string): void {
    this.pageNo = 1
  }
  //reset filter
  resetFilter(){
    this.searchUser = '';
  }
}
