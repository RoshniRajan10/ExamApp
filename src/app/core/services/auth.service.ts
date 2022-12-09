import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { AuthModel } from '../models'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private angularFireAuth: AngularFireAuth) {}

  authenticate(objAuth: AuthModel) {
    return this.angularFireAuth.auth
      .signInWithEmailAndPassword(objAuth.emailAddress, objAuth.password)
      .then(
        (data) => {
          const {
            user: { uid, email },
          } = data
          return { uid, email }
        },
        (error) => {
          console.log(error)
        }
      )
  }
}
