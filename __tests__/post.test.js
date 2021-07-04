const request = require('supertest');
const app = require('../app');

describe("post-test", () => {
    // for (let i = 10; i < 20; ++i) {
    //     testCreatePost(`child post ${i}`, `this is child post ${i}`, 1);
    // }

    testPostDetail(1, false);
    // testGetPostLinkList(33);
    // testDeletePostLink(33, 1);
    // testCreatePostLink(33, 6);
    // for (let i = 0; i < 5; i++) {
    //     testCreatePost(`bg's post (${i})`, `hello universe! ${i}`);
    // }

    // testGetPostLinkList(1);
    // testCreatePost(`test post (${i})`, `hello world!!! ${i}`);
    // testPostList(10, 0, false);
    // testDeletePost(19);
    // testUpdatePost(23, null, null, [1]);
    // testLikeOrDisLike(21, null);
    // testDeletePostLink(1, 1);
    // testPostDetail(21, true);
});

function testDeletePostLink(postId, linkId) {
    it("delete_post_link", async (done) => {
        const userToken = await getUserToken();

        request(app)
            .delete(`/api/posts/${postId}/links/${linkId}`)
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

function testGetPostLinkList(srcPostId) {
    it("get_post_link_list", async (done) => {
        const userToken = await getUserToken();

        request(app)
            .get(`/api/posts/${srcPostId}/links`)
            .set("Accept", "application/json")
            .set("Authorization", userToken)
            .expect("Content-Type", /json/)
            .expect(200)
            .then(res => {
                console.log('>>>', res.body);
                done();
            })
            .catch(err => {
                done(err)
            });
    });
}

function testCreatePostLink(srcPostId, targetPostId) {
    it("create_post_link", async (done) => {
        const userToken = await getUserToken();

        request(app)
            .post(`/api/posts/${srcPostId}/link`)
            .send({targetPostId})
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

function testLikeOrDisLike(postId, likeType) {
    it("like_post", async (done) => {
        let userToken = null;
        userToken = await getUserToken();

        request(app)
            .post(`/api/posts/${postId}/like`)
            .send({likeType})
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

function testCreatePost(title, content, parentId) {
    it("create_post", async (done) => {
        let userToken = null;
        userToken = await getUserToken();

        request(app)
            .post(`/api/post`)
            .send({title, content, parentId})
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
                console.log(res.body)
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
            .send({emailOrUsername: 'bg@naver.com', password: '1234'})
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