const { db_utils, error } = require("../libs/stdlib.js" );
const query = require('./queryPost.js');

module.exports.deletePostLink = async function (
    nUserId,
    nPostId,
    nLinkId
) {
    db_utils.assertNumbers(nUserId, nPostId, nLinkId);

    return await db_utils.defaultQueryWithTransaction(async (client) => {
        await checkIfUserHasPermissionToUpdatePost(client, nUserId, nPostId);
        return await query.deletePostLink(client, nLinkId);
    });
}


module.exports.createPostLink = async function (
    nUserId,
    nSrcPostId,
    nTargetPostId
) {
    db_utils.assertNumbers(nUserId, nSrcPostId, nTargetPostId);

    return await db_utils.defaultQueryWithTransaction(async (client) => {
        await checkIfUserHasPermissionToUpdatePost(client, nUserId, nSrcPostId);
        return await query.createPostLink(client, nSrcPostId, nTargetPostId);
    });
}

module.exports.getPostLinkList = async function (
    nUserId, 
    nPostId
) {
    db_utils.assertNumbers(nUserId, nPostId);

    return await db_utils.defaultQueryWithTransaction(async (client) => {
        await checkIfUserHasPermissionToUpdatePost(client, nUserId, nPostId);
        return await query.getPostLinkList(client, nPostId);
    });
}


module.exports.getPostList = async function (
    nUserId,
    nNum,
    nOffset,
    strTitle
) {
    db_utils.assertNumbers(nNum, nOffset);

    return await db_utils.defaultQuery(async (client) => {
        return await query.getPostList(client, nUserId, nNum, nOffset, strTitle);
    });
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

        const parentInfo = postDetail.parentId === null 
            ? null 
            : await query.getPostDetail(client, nUserId, postDetail.parentId);

        postDetail.parentInfo = parentInfo;
        
        delete postDetail.postId;

        return postDetail;
    });
}

module.exports.deletePost = async function(nUserId, nPostId) {
    db_utils.assertNumbers(nUserId, nPostId);

    return await db_utils.defaultQueryWithTransaction(async (client) => {
        await checkIfUserHasPermissionToUpdatePost(client, nUserId, nPostId);
        await query.archivePost(client, nPostId);
    });
}

module.exports.updatePost = async function(nUserId, nPostId, title, content, categoryIds) {
    db_utils.assertNumbers(nUserId, nPostId);

    return await db_utils.defaultQueryWithTransaction(async (client) => {
        await checkIfUserHasPermissionToUpdatePost(client, nUserId, nPostId);
        await query.updatePost(client, nPostId, title, content, categoryIds);
    });
} 

module.exports.likeOrDislikePost = async function(nUserId, nPostId, likeType) {
    db_utils.assertNumbers(nUserId, nPostId);
    
    await db_utils.defaultQuery(async (client) => {
        await query.likeOrDislikePost(client, nUserId, nPostId, likeType);
    })
}


async function checkIfUserHasPermissionToUpdatePost(client, nUserId, nPostId) {
    db_utils.assertNumbers(nUserId, nPostId);

    const canUpdatePost = await query.canUpdatePost(client, nUserId, nPostId);

    if (canUpdatePost === false) {
        throw error.newInstanceForbiddenError();
    }
}