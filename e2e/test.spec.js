describe('Protractor Demo App', function() {
  it('should have a title', function() {
    browser.get('http://localhost:5000');

    expect(browser.getTitle()).toEqual('Task.md');
  });
});