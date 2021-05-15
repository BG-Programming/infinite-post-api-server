const request = require('supertest');
// const assert = require('assert');
const app = require('../app');

describe("bg-programming-api-test", () => {
  // it('signup 200', async (done) => {
  //   await request(app)
  //       .post('/api/signup')
  //       .send({email: 'bg12345333@programming.com', nickname: 'BG1233345', password: '12341234'})
  //       .set("Accept", "application/json")
  //       .expect(200)
  //       .then(res => {
  //         console.log('body >>>', res.body)
  //         done();
  //       })
  //       .catch(err => {
  //         console.error(err);
  //         done(err)
  //       });
  // });

  it("login", async (done) => {
    await request(app)
      .post("/api/login")
      .send({email: 'bg12345333@programming.com', password: '12341234'})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        console.log('body >>>', res.body)
        done();
      })
      .catch(err => {
        console.error(err);
        done(err)
      });
  });
});