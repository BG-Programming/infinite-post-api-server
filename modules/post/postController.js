const { utils }         = require("../libs/stdlib.js" );
const db = require("./dbPost");

module.exports.route = function(api, app) {
    api.get('/api/posts/:num/:offset',  getPostList);
    api.get('/api/posts/:postId',       getPostDetail);

    api.post('/api/post',               createPost);
    api.put('/api/posts/:postId',       updatePost);
    api.delete('/api/posts/:postId',    deletePost);
};

async function getPostList(userInfo, params, body) {
    
}


async function getPostDetail(userInfo, params, _) {
    const {postId} = params;
    const {userId} = userInfo;
    const nPostId = Number(postId);

    utils.checkRequiredNumberParameter(nPostId);

    return await db.getPostDetail(userId, nPostId);
}

async function createPost(userInfo, _, body) {
    const nUserId = userInfo.userId;
    const {parentId, title, content} = body;

    utils.checkRequiredStringParameter(title);
    utils.checkOptionalNumberParameter(parentId);
    utils.checkOptionalStringParameter(content);

    await db.createPost(
        nUserId, 
        parentId || null, 
        title, 
        content || null
    );
}

async function updatePost(userInfo, params, body) {

}

async function deletePost(userInfo, params, _) {

}
