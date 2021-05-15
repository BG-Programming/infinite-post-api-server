const request = require('supertest');
const assert = require('assert');
const app = require('../app');

describe("bg-programming-api-test", () => {
  it('signup', async (done) => {
    await request(app)
        .post('/api/signup')
        .send({email: 'bg12345@programming.com', nickname: 'BG12345', password: '12341234'})
        .set("Accept", "application/json")
        .expect(400)
        .then(res => {
          console.log('>>>', res.body)
          done();
        })
        .catch(err => {
          console.error(err);
          done(err)
        });
  });

  // it("login", async (done) => {
  //   await request(app)
  //     .post("/api/user/login")
  //     .set("Accept", "application/json")
  //     .expect("Content-Type", /json/)
  //     .expect(200)
      // .then(res => {
      //   const {body} = res;
      //   assert.strictEqual(body.hello, 'world');
      //   done();
      // })
      // .catch(err => {
      //   console.error(err);
      //   done(err)
      // });
  // });
});