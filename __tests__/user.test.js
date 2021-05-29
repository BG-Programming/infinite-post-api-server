const request = require('supertest');
// const assert = require('assert');
const app = require('../app');

describe("bg-programming-api-test", () => {

  it("login", async (done) => {
    testPostDetail(app, done, 12);
  });
});

function testLogin() {
  request(app)
    .post("/api/login")
    .send({emailOrUsername: 'root_user', password: '1234'})
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .then(res => {
      console.log('>>', res.body);
      // resolve(res.body.token);
      done();
    })
    .catch(err => {
      // console.error(err);
      done(err)
    });
}

  // it('signup 200', async (done) => {
  //   await request(app)
  //       .post('/api/signup')
  //       .send({email: 'test@programming.com', username: 'testUser', password: '1234'})
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


 // const resToken = await new Promise((resolve, reject) => {
    //   request(app)
    //     .post("/api/login")
    //     .send({email: 'root@programming.com', password: '1234'})
    //     .set("Accept", "application/json")
    //     .expect("Content-Type", /json/)
    //     .expect(200)
    //     .then(res => {
    //       resolve(res.body.token);
    //       // done();
    //     })
    //     .catch(err => {
    //       // console.error(err);
    //       done(err)
    //     });
    // });

    // await request(app)
    //   .post("/api/post")
    //   .send({parentId: 17, title: "this is child post!", content: "good job~!!"})
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

    
  // });


  function testPostDetail(app, done, postId) {
    console.log('!@#!@#@!#!@', postId)
    request(app)
      .get(`/api/posts/${postId}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        console.log(res.body);
        done();
      })
      .catch(err => {
        done(err)
      });
  }