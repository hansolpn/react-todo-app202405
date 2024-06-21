describe('메인화면', () => {
  it('로그인 하지 않았을 때 로그인 화면으로 이동', () => {
    cy.intercept('http://localhost:8181/api/todos**', {
      statusCode: 401,
      body: { message: 'INVALID_AUTH' },
    });

    cy.visit('http://localhost:3000/todo');
    cy.get('h1').eq(0).contains('로그인');
  });
});
