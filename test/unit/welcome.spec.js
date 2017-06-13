import {bootstrap} from 'aurelia-bootstrapper';
import {StageComponent} from 'aurelia-testing';

describe('WelcomeComponent', () => {
  let component;

  beforeEach(async () => {
    component = StageComponent
      .withResources('welcome')
      .inView('<welcome></welcome>');
    await component.create(bootstrap);
  });

  // only jest supports creating snapshot:
  if (jest) {
    it('should render correctly', () => {
      expect(document.body.outerHTML).toMatchSnapshot();
    });
  }

  it('should render first name', () => {
    const nameElement = document.querySelector('#fn');
    expect(nameElement.value).toBe('John');
  });

  afterEach(() => {
    component.dispose();
  });
});
