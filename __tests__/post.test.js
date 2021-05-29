const request = require('supertest');
const app = require('../app');

describe("post-test", async () => {
    try {
        testPostDetail(13, false);
        testPostList(10, 0, false);
    } catch (err) {
        console.error(err);
    }
});

function testPostList(num, offset, withAuth) {
    it("post_list", async (done) => {

        let userToken = null;

        if (withAuth === true) {
            userToken = await getUserToken();
        }

        request(app)
            .get(`/api/posts/${num}/${offset}`)
            .set("Accept", "application/json")
            .set("Authorization", userToken)
            .expect("Content-Type", /json/)
            .expect(200)
            .then(res => {
                console.log(res.body);
                done();
            })
            .catch(err => {
                done(err)
            });
    });
}

function testPostDetail(postId, withAuth) {
    it("post_detail", async (done) => {
        
        let userToken = null;

        if (withAuth === true) {
            userToken = await getUserToken();
        }

        request(app)
            .get(`/api/posts/${postId}`)
            .set("Accept", "application/json")
            .set("Authorization", userToken)
            .expect("Content-Type", /json/)
            .expect(200)
            .then(res => {
                done();
            })
            .catch(err => {
                done(err)
            });
    });
}

function getUserToken() {
    return new Promise((resolve, reject) => {
        request(app)
            .post("/api/login")
            .send({emailOrUsername: 'root_user', password: '1234'})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(res => {
                console.log('>>>>>>', res.body)
                resolve(res.body.token);
            })
            .catch(err => {
                reject(err)
            });
    });
}