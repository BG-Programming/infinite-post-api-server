const { assert } = require("../libs/stdlib.js" );

module.exports.createPost = async function (
    client, 
    nUserId,
    nParentIdOrNull,
    strTitle,
    strContent,
) {
    const sql = `
        insert into post(user_account_id, parent_id, title, content)
        values($1, $2, $3, $4) returning id
    `;

    const result = await client.query(sql, [nUserId, nParentIdOrNull, strTitle, strContent]);
    assert(result.rowCount === 1);
};

module.exports.addOneToNumOfChildren = async function(client, nPostId) {
    const selectQuery = `
        select num_of_children as "numOfChildren"
        from post
        where id = $1
    `;

    const selectResult = await client.query(selectQuery, [nPostId]);

    assert(selectResult.rowCount === 1);

    const {numOfChildren} = selectResult.rows[0];

    const updateQuery = `
        update post
        set num_of_children = $1
        where id = $2
    `;

    const updateResult = await client.query(updateQuery, [numOfChildren + 1, nPostId]);

    assert(updateResult.rowCount === 1);
}

const likeTypeQuery = `
    COALESCE((
        select like_type
        from user_like_or_dislike_post
        where post_id = $1 and user_account_id = $2
    ), null) as "likeType"
`;

module.exports.getPostDetail = async function(client, nUserId, nPostId) {
    const query = `
        select      p.*,
                    COALESCE((
                        select  like_type
                        from    user_like_or_dislike_post
                        where   post_id = $1 and user_account_id = $2
                    ), null) as "likeType"
        from        post as p
        where       id = $1 
    `;

    const result = await client.query(query, [nPostId, nUserId]);  

    assert(result.rowCount === 1);

    return result.rows[0];
}

module.exports.getPostListWithParentId = async function(client, nUserId, nParentId) {
    const query = `
        select      p.* ,
                    COALESCE((
                        select  like_type
                        from    user_like_or_dislike_post
                        where   post_id = p.id and user_account_id = $2
                    ), null) as "likeType"
        from        post as p
        where       parent_id = $1
    `;

    const result = await client.query(query, [nParentId, nUserId]);
    return result.rows;
}