describe('로그인 화면', () => {
  it('로그인 성공', () => {
    cy.intercept(
      'POST',
      'http://localhost:8181/api/auth/signin',
      {
        statusCode: 200,
        body: {
          token: '1',
          userName: 'test user',
          role: 'COMMON',
        },
      },
    ).as('postLogin');
    cy.intercept('http://localhost:8181/api/todos**', {
      statusCode: 200,
      body: { todos: [] },
    }).as('getTodos');
    cy.intercept(
      'http://localhost:8181/api/auth/load-profile',
      {
        statusCode: 201,
      },
    );

    cy.visit('http://localhost:3000/login');

    cy.get('input#email').type('test@gmail.com');
    cy.get('input#password').type('1234');
    cy.get('button[type=submit]').click();

    cy.wait(['@postLogin', '@getTodos']);

    cy.get('div').should('have.class', 'TodoTemplate');
  });

  it('로그인 실패', () => {
    cy.intercept(
      'POST',
      'http://localhost:8181/api/auth/signin',
      {
        statusCode: 403,
        body: '로그인 실패',
      },
    ).as('postLogin');

    cy.visit('http://localhost:3000/login');
    cy.get('input#email').type('test@gmail.com');
    cy.get('input#password').type('1234');
    cy.get('button[type=submit]').click();

    cy.wait('@postLogin');

    cy.on('window:alert', (message) => {
      expect(message).to.contains('로그인 실패');
    });
  });
});
