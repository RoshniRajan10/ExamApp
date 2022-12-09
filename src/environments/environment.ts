// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig_prod: {
    apiKey: 'AIzaSyAVGFXyMSZIdyVBWiQr1OfiMJ4P20p1mtA',
    authDomain: 'exam-app-compidigi.firebaseapp.com',
    databaseURL: 'https://exam-app-compidigi-default-rtdb.firebaseio.com',
    projectId: 'exam-app-compidigi',
    storageBucket: 'exam-app-compidigi.appspot.com',
    messagingSenderId: '334319963705',
    appId: '1:334319963705:web:199d7fd70de544204347e8',
    measurementId: 'G-3H956B1B0C',
  },
  push_notify_prod: {
    app_id: '10fd1cdc-0d97-474d-a6cf-a04e3a05efa0',
    included_segments: ['Subscribed Users'],
    android_group: 'Current Affairs',
    android_accent_color: '512DA8',
    authorize_key: 'Basic MDY2YWQ3ZWUtY2E2OS00ZmIyLTljZjEtNDlmZTFhNDBhOWQx',
    api: 'https://onesignal.com/api/v1/notifications',
  },

  firebaseConfig: {
    apiKey: 'AIzaSyCkqeJHLSQ-MhZg1llCkm1N_5NvVDIABRI',
    authDomain: 'exam-app-latest.firebaseapp.com',
    databaseURL: 'https://exam-app-latest.firebaseio.com',
    projectId: 'exam-app-latest',
    storageBucket: 'exam-app-latest.appspot.com',
    messagingSenderId: '46198450584',
    appId: '1:46198450584:web:2fe348a932a0b5e6fca3ed',
    measurementId: 'G-NL6BSMRP9L',
  },
  
  push_notify: {
    app_id: 'd104d72b-5a1c-432d-9924-66d77b28b117',
    included_segments: ['Subscribed Users'],
    android_group: 'Current Affairs',
    android_accent_color: '512DA8',
    authorize_key: 'Basic NTM0YzQ1NTUtZGI3NC00Mzc0LWIxYWYtYTBiMzcwOTgyYzBi',
    api: 'https://onesignal.com/api/v1/notifications',
  }

  // exam latest conf /////

  // firebaseConfig: {
  //   apiKey: 'AIzaSyCkqeJHLSQ-MhZg1llCkm1N_5NvVDIABRI',
  //   authDomain: 'http://localhost:9090',
  //   databaseURL: 'http://localhost:9000/?ns=exam-app-latest',
  //   projectId: 'exam-app-latest',
  //   storageBucket: 'exam-app-latest.appspot.com',
  //   messagingSenderId: '46198450584',
  //   appId: '1:46198450584:web:2fe348a932a0b5e6fca3ed',
  //   measurementId: 'G-NL6BSMRP9L',
  // },
  // push_notify: {
  //   app_id: 'd104d72b-5a1c-432d-9924-66d77b28b117',
  //   included_segments: ['Subscribed Users'],
  //   android_group: 'Current Affairs',
  //   android_accent_color: '512DA8',
  //   authorize_key: 'Basic NTM0YzQ1NTUtZGI3NC00Mzc0LWIxYWYtYTBiMzcwOTgyYzBi',
  //   api: 'https://onesignal.com/api/v1/notifications',
  // }

  //// end  ////////////

  
  // firebaseConfig: {
  //   apiKey: 'AIzaSyCkqeJHLSQ-MhZg1llCkm1N_5NvVDIABRI',
  //   authDomain: 'localhost:9099',
  //   databaseURL: 'http://localhost:9000/?ns=exam-app-latest',
  //   projectId: 'exam-app-latest',
  //   storageBucket: 'exam-app-latest.appspot.com',
  //   messagingSenderId: '46198450584',
  //   appId: '1:46198450584:web:2fe348a932a0b5e6fca3ed',
  //   measurementId: 'G-NL6BSMRP9L',
  // },
  // push_notify: {
  //   app_id: 'd104d72b-5a1c-432d-9924-66d77b28b117',
  //   included_segments: ['Subscribed Users'],
  //   android_group: 'Current Affairs',
  //   android_accent_color: '512DA8',
  //   authorize_key: 'Basic NTM0YzQ1NTUtZGI3NC00Mzc0LWIxYWYtYTBiMzcwOTgyYzBi',
  //   api: 'https://onesignal.com/api/v1/notifications',
  // },
}

// export const environment = {
//   production: false,
//   firebaseConfig: {
//   apiKey: 'AIzaSyA7GYVL_oCCJXAaCYQBqnnIvSFi_uGO7To',
//   authDomain: 'exam-app-debug.firebaseapp.com',
//   databaseURL: 'https://exam-app-debug.firebaseio.com',
//   projectId: 'exam-app-debug',
//   storageBucket: 'exam-app-debug.appspot.com',
//   messagingSenderId: '498327605335'
// },
// }

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
