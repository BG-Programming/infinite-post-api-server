const request = require('supertest');
const app = require('../app');

describe("post-test", () => {

    testCreatePost('hahaha', 'hello world');
    testPostDetail(13, true);
    testPostList(10, 0, false);
    testDeletePost(19);
    testUpdatePost(21, null, null, [1]);
});

function testCreatePost(title, content) {
    it("create_post", async (done) => {
        let userToken = null;
        userToken = await getUserToken();

        request(app)
            .post(`/api/post`)
            .send({title, content})
            .set("Accept", "application/json")
            .set("Authorization", userToken)
            .expect(200)
            .then(res => {
                done();
            })
            .catch(err => {
                done(err)
            });
    });
}

function testUpdatePost(postId, title, content, categoryIds) {
    it("update_post", async (done) => {
        let userToken = null;
        userToken = await getUserToken();

        request(app)
            .put(`/api/posts/${postId}`)
            .send({title, content, categoryIds})
            .set("Accept", "application/json")
            .set("Authorization", userToken)
            .expect(200)
            .then(res => {
                done();
            })
            .catch(err => {
                done(err)
            });
    });
} 

function testDeletePost(postId) {
    it("delete_post", async (done) => {
        let userToken = null;
        userToken = await getUserToken();

        request(app)
            .delete(`/api/posts/${postId}`)
            .set("Accept", "application/json")
            .set("Authorization", userToken)
            // .expect("Content-Type", /json/)
            .expect(200)
            .then(res => {
                done();
            })
            .catch(err => {
                done(err)
            });
    });
}

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
                resolve(res.body.token);
            })
            .catch(err => {
                reject(err)
            });
    });
}