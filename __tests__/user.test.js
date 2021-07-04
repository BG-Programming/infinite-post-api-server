const request = require('supertest');
const app = require('../app');

describe("user-test", () => {
  testSignup('bg@naver.com', 'bg', '1234');
  testLogin('abc1234@naver.com', '1234');
});

function testLogin(emailOrUsername, password) {
  it("login", async (done) => {
    request(app)
      .post("/api/login")
      .send({emailOrUsername, password})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        console.log('login >>> ', res.body);
        done();
      })
      .catch(err => {
        done(err)
      });
  });
}

function testSignup(email, username, password) {
  it('signup', async (done) => {
    request(app)
      .post('/api/signup')
      .send({email, username, password})
      .set("Accept", "application/json")
      .expect(400)
      .then(res => {
        done();
      })
      .catch(err => {
        console.error(err);
        done(err)
      });
  });
}
  