contract('Piggy Bank', (accounts) => {
  describe('Deploy', () => {
    it('should fail if no name is provided');
    it('should deploy successfully upon name being provided');
  });
  describe('Operational explicit invocation', () => {
    it('should allow anyone to send ether');
    it('should allow the owner to withdraw money');
    it('should avoid anyone withdrawing money');
    it('should count savings by sender and amount');
    it('should avoid anyone taking ownership');
    it('should allow the owner to transfer the piggy bank');
    it('should avoid anyone destroying the piggy bank');
    it('should allow the owner to destroy the piggy bank');
  });
  describe('Operational implicit invocation', () => {
    it('should allow anyone to send ether');
    it('should allow the owner to withdraw money');
    it('should avoid anyone withdrawing money');
  });
});
