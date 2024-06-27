describe('회원 가입 화면', () => {
  const parentX3 = (f) => {
    return f.parent().parent().parent();
  };

  it('회원가입', () => {
    cy.intercept('http://localhost:8181/api/auth/check**', {
      statusCode: 200,
      body: false,
    }).as('postEmailCheck');
    cy.intercept('POST', 'http://localhost:8181/api/auth', {
      statusCode: 200,
      body: {
        userName: '홍길동',
        email: 'test@gmail.com',
      },
    }).as('postRegister');
    cy.fixture('pic.png', null).as('profile');
    cy.visit('http://localhost:3000/join');

    cy.get('label.signup-img-label').selectFile('@profile');
    cy.wait(500);
    cy.get('input#username').type('홍길동');
    cy.wait(500);
    cy.get('input#email').type('test@gmail.com');
    cy.wait('@postEmailCheck');
    cy.wait(500);
    cy.get('input#password').type('aa12345678!');
    cy.wait(500);
    cy.get('input#password-check').type('aa12345678!');
    cy.wait(500);
    cy.get('button[type=submit]').click();
    cy.wait('@postRegister');
    // .then((intercept) => {
    //   const icpt = intercept;
    //   console.log(icpt.request.body);
    //   console.log(icpt.request.headers);
    //   - body의 내용(ArrayBuffer)를 base64로 변환
    //   let binary = '';
    //   let bytes = new Uint8Array(icpt.request.body);
    //   let len = bytes.byteLength;
    //   for (let i = 0; i < len; i++) {
    //     binary += String.fromCharCode(bytes[i]);
    //   }
    //   console.log(window.btoa(binary));
    // });

    cy.on('window:alert', (message) => {
      expect(message).to.contains(
        '회원가입에 성공했습니다',
      );
    });
    cy.get('h1').eq(0).contains('로그인');
  });

  it('회원가입(입력 확인)', () => {
    cy.intercept(
      'http://localhost:8181/api/auth/check**',
      (req) => {
        console.log(req.query.email);
        let result = true;
        if (req.query.email === 'test@gmail.com') {
          // test@gmail.com만 이메일 중복 검사 통과
          result = false;
        }
        req.reply(200, result);
      },
    ).as('postEmailCheck');
    cy.intercept('POST', 'http://localhost:8181/api/auth', {
      statusCode: 200,
      body: {
        userName: '홍길동',
        email: 'test@gmail.com',
      },
    }).as('postRegister');
    cy.visit('http://localhost:3000/join');

    let fail = true;
    cy.on('window:alert', (message) => {
      console.log(fail);
      if (fail) {
        expect(message).to.contains('입력란을 다시 확인');
      } else {
        expect(message).to.contains(
          '회원가입에 성공했습니다',
        );
      }
    });

    // 폼을 오류가 나도록 입력
    cy.get('input#username').type('fail');
    parentX3(cy.get('input#username')).contains(
      'span',
      '2~5글자 사이의 한글로 작성하세요!',
    );

    cy.get('input#email').type('fail@gmail.com');
    cy.wait('@postEmailCheck');
    parentX3(cy.get('input#email')).contains(
      'span',
      '이메일이 중복되었습니다.',
    );

    cy.get('input#password').type('12345678');
    parentX3(cy.get('input#password')).contains(
      'span',
      '8글자 이상의 영문, 숫자, 특수문자를 포함해 주세요.',
    );

    cy.get('input#password-check').type('12345679');
    parentX3(cy.get('input#password-check')).contains(
      'span',
      '비밀번호가 일치하지 않습니다.',
    );

    cy.get('button[type=submit]').click();

    // 폼을 정상적으로 입력
    cy.wait(1000).then(() => {
      // 알림 메시지을 체크 할때의 문장을 '회원가입에 성공했습니다'로 변경
      fail = false;
    });
    cy.get('input#username').clear().type('홍길동');
    parentX3(cy.get('input#username')).contains(
      'span',
      '사용 가능한 이름입니다.',
    );
    cy.get('input#email').clear().type('test@gmail.com');
    cy.wait('@postEmailCheck');
    parentX3(cy.get('input#email')).contains(
      'span',
      '사용 가능한 이메일 입니다.',
    );
    cy.get('input#password').clear().type('aa12345678!');
    parentX3(cy.get('input#password')).contains(
      'span',
      '사용 가능한 비밀번호 입니다.',
    );
    cy.get('input#password-check')
      .clear()
      .type('aa12345678!');
    parentX3(cy.get('input#password-check')).contains(
      'span',
      '비밀번호가 일치합니다.',
    );
    cy.get('button[type=submit]').click();

    // 로그인 화면
    cy.get('h1').eq(0).contains('로그인');
  });
});
