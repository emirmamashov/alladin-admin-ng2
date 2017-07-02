import { AlladinAdminNg2Page } from './app.po';

describe('alladin-admin-ng2 App', () => {
  let page: AlladinAdminNg2Page;

  beforeEach(() => {
    page = new AlladinAdminNg2Page();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
