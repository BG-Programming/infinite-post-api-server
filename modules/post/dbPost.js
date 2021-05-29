const { db_utils, error } = require("../libs/stdlib.js" );
const query = require('./queryPost.js');

module.exports.getPostList = async function (
    nUserId,
    nNum,
    nOffset
) {
    db_utils.assertNumbers(nNum, nOffset);

    return await db_utils.defaultQuery(async (client) => {
        return await query.getPostList(client, nUserId, nNum, nOffset);
    })
}

module.exports.createPost = async function(
    nUserId,
    nParentIdOrNull,
    strTitle,
    strContent
) {
    db_utils.assertNumbers(nUserId);
    db_utils.assertStrings(strTitle, strContent);

    await db_utils.defaultQueryWithTransaction(async (client) => {
        await query.createPost(client, nUserId, nParentIdOrNull, strTitle, strContent);

        if (nParentIdOrNull !== null) {
            await query.addOneToNumOfChildren(client, nParentIdOrNull);
        }
    });
}

module.exports.getPostDetail = async function(nUserId, nPostId) {
    db_utils.assertNumbers(nPostId);

    return await db_utils.defaultQueryWithTransaction(async (client) => {
        const postDetail = await query.getPostDetail(client, nUserId, nPostId);
        const children = await query.getPostListWithParentId(client, nUserId, nPostId);
        postDetail.children = children;
        return postDetail;
    });
}

module.exports.deletePost = async function(nUserId, nPostId) {
    db_utils.assertNumbers(nUserId, nPostId);

    return await db_utils.defaultQueryWithTransaction(async (client) => {
        const canUpdatePost = await query.canUpdatePost(client, nUserId, nPostId);

        if (canUpdatePost === false) {
            throw error.newInstanceForbiddenError();
        }

        await query.archivePost(client, nPostId);
    });
}

module.exports.updatePost = async function(nUserId, nPostId, title, content, categoryIds) {
    db_utils.assertNumbers(nUserId, nPostId);

    return await db_utils.defaultQueryWithTransaction(async (client) => {
        const canUpdatePost = await query.canUpdatePost(client, nUserId, nPostId);

        if (canUpdatePost === false) {
            throw error.newInstanceForbiddenError();
        }

        await query.updatePost(client, nPostId, title, content, categoryIds);
    });
} 