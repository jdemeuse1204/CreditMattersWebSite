import {useView} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {account} from '../common/repository';
import globalAjax from '../common/globalAjax';

@useView('../views/app.html')
export class App {

  constructor() {

    // register global ajax
    globalAjax();

  }

  configureRouter(config, router) {
    var step = new AuthorizeStep;
    config.addAuthorizeStep(step)
    config.title = 'Credit Matters';
    config.map([
      // un auth routes
      { route: ['', 'home'], name: 'home',      moduleId: './home',      nav: true, title: 'Home' },
      { route: 'login', name: 'login',      moduleId: './login',      nav: true, title: 'Login' },
      { route: 'register', name: 'register',      moduleId: './register',      nav: true, title: 'Register' },

      // management routes
      { route: 'Management/ManageCreditItems', name: 'ManageCreditItems', moduleId: './management/manageCreditItems', nav: true, title: 'Manage Credit Items', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout' },
      { route: 'Management/LinkedProfessional', name: 'LinkedProfessional', moduleId: './management/linkedProfessional', nav: true, title: 'Linked Professional', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout' },
      { route: 'Management/StallLetters', name: 'StallLetters', moduleId: './management/stallLetters', nav: true, title: 'Stall Letters', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout' },
      { route: 'Management/Credit Cards', name: 'CreditCards', moduleId: './management/creditCards', nav: true, title: 'Credit Cards', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout' },
      { route: 'Management/HelpfulVideos', name: 'HelpfulVideos', moduleId: './management/helpfulVideos', nav: true, title: 'Helpful Videos', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout' },
      { route: 'Management/EstablishAccounts', name: 'EstablishAccounts', moduleId: './management/establishAccounts', nav: true, title: 'Establish Accounts', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout' },
      { route: 'Management/ResolvingCDS', name: 'ResolvingCDS', moduleId: './management/resolvingCDS', nav: true, title: 'Resolving CDS', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout' },
      { route: 'Management/TrackingDisputeActivity', name: 'TrackingDisputeActivity', moduleId: './management/trackingDisputeActivity', nav: true, title: 'Tracking Dispute Activity', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout' },
      
      { route: 'users',         name: 'users',        moduleId: './users',        nav: true, title: 'Github Users', settings: { auth: true } },
      { route: 'child-router',  name: 'child-router', moduleId: './child-router', nav: true, title: 'Child Router' }
    ]);

    this.router = router;
  }
}

class AuthorizeStep {
  run(navigationInstruction, next) {

    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
      return next(); // always authorize for now
      // return account.isAdmin().then((response) => {
        
      //   if (response.Data.success === true) {
      //     return next();
      //   }

      //   return next.cancel(new Redirect('login'));
      // });
    }

    return next();
  }
}
