import { useView } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { account } from '../common/repository';
import { includes } from 'lodash';
import { routes } from '../constants';

@useView('../views/app.html')
export class App {

  constructor() {

  }

  configureRouter(config, router) {
    var step = new AuthorizeStep;
    config.addAuthorizeStep(step)
    config.title = 'Credit Matters';
    config.map([
      // un auth routes
      { route: ['', 'home'], name: 'home', moduleId: './home', nav: true, title: 'Home' },
      { route: 'login', name: 'login', moduleId: './login', nav: true, title: 'Login' },
      { route: 'register', name: 'register', moduleId: './register', nav: true, title: 'Register' },
      { route: 'activate/:rid?', name: 'activate', moduleId: './activate', nav: true, href: "#/activate", title: 'Activate' },
      { route: ['error'], name: 'error', moduleId: './error', nav: true, title: 'Error' },

      // management routes
      { route: 'Management/Courses', name: 'Courses', moduleId: './management/courses', nav: true, title: 'Courses', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/UploadFiles', name: 'Upload Files', moduleId: './management/uploadFiles', nav: true, title: 'Upload Files', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/ManageCreditItems', name: 'ManageCreditItems', moduleId: './management/manageCreditItems', nav: true, title: 'Manage Credit Items', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/LinkedProfessional', name: 'LinkedProfessional', moduleId: './management/linkedProfessional', nav: true, title: 'Linked Professional', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/StallLetters', name: 'StallLetters', moduleId: './management/stallLetters', nav: true, title: 'Stall Letters', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/Credit Cards', name: 'CreditCards', moduleId: './management/creditCards', nav: true, title: 'Credit Cards', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/HelpfulVideos', name: 'HelpfulVideos', moduleId: './management/helpfulVideos', nav: true, title: 'Helpful Videos', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/EstablishAccounts', name: 'EstablishAccounts', moduleId: './management/establishAccounts', nav: true, title: 'Establish Accounts', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/ResolvingCDS', name: 'ResolvingCDS', moduleId: './management/resolvingCDS', nav: true, title: 'Resolving CDS', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/TrackingDisputeActivity', name: 'TrackingDisputeActivity', moduleId: './management/trackingDisputeActivity', nav: true, title: 'Tracking Dispute Activity', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/MyProfile', name: 'MyProfile', moduleId: './management/myProfile', nav: true, title: 'My Profile', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/TransUnionCreditItems', name: 'TransUnionCreditItems', moduleId: './management/transUnionCreditItems', nav: true, title: 'TransUnion Credit Items', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/EquifaxCreditItems', name: 'EquifaxCreditItems', moduleId: './management/equifaxCreditItems', nav: true, title: 'Equifax Credit Items', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/ExperianCreditItems', name: 'ExperianCreditItems', moduleId: './management/experianCreditItems', nav: true, title: 'Experian Credit Items', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },

      // admin
      { route: 'Management/Admin', name: 'Admin', moduleId: './management/admin', nav: true, title: 'Admin', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
    ]);

    config.mapUnknownRoutes('./home');
    config.fallbackRoute('./error');
    this.router = router;
  }
}

class AuthorizeStep {
  run(navigationInstruction, next) {

    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {

      if (includes(navigationInstruction.fragment, "Management/") === true) {

        return account.canAccessManagementPages().then((response) => {

          if (!!response && response.Data.success === true) {
            return next();
          }

          return next.cancel(new Redirect('Login'));
        });
      }

      return next();
    }

    return next();
  }
}
