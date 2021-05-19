const { db_utils } = require("../libs/stdlib.js" );
const query = require('./queryPost.js');

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
    db_utils.assertNumbers(nUserId, nPostId);

    return await db_utils.defaultQueryWithTransaction(async (client) => {
        const postDetail = await query.getPostDetail(client, nUserId, nPostId);
        const children = await query.getPostListWithParentId(client, nUserId, nPostId);
        postDetail.children = children;
        return postDetail;
    });
}