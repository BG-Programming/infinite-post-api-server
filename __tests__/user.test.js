const request = require('supertest');
// const assert = require('assert');
const app = require('../app');

describe("bg-programming-api-test", () => {
  // it('signup 200', async (done) => {
  //   await request(app)
  //       .post('/api/signup')
  //       .send({email: 'root@programming.com', nickname: 'root_user', password: '1234'})
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
    const resToken = await new Promise((resolve, reject) => {
      request(app)
        .post("/api/login")
        .send({email: 'root@programming.com', password: '1234'})
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then(res => {
          resolve(res.body.token);
          // done();
        })
        .catch(err => {
          // console.error(err);
          done(err)
        });
    });

    await request(app)
      .get("/api/posts/12")
      .set("Authorization", resToken)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        done();
      })
      .catch(err => {
        done(err)
      });

    // await request(app)
    //   .post("/api/post")
    //   .send({parentId: 12, title: "random 123123123123", content: "good job~!"})
    //   .set("Authorization", resToken)
    //   .set('Accept', 'application/json')
    //   .expect("Content-Type", /json/)
    //   .expect(200)
    //   .then(res => {
    //     // resolve(res.body);
    //     done();
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     // reject(err);
    //     done(err)
    //   });
  });
});