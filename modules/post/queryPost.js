const { assert } = require("../libs/stdlib.js" );

module.exports.deletePostLink = async function (
    client,
    nLinkId
) {
    const sql = `
        DELETE FROM post_link
        WHERE id = $1
    `;

    const result = await client.query(sql, [nLinkId]);

    assert(result.rowCount === 1);
}

module.exports.createPostLink = async function(
    client,
    nSrcPostId,
    nTargetPostId
) {
    const sql = `
        INSERT INTO post_link (src_id, target_id)
        VALUES ($1, $2)
    `;

    const result = await client.query(sql, [nSrcPostId, nTargetPostId]);

    assert(result.rowCount === 1);
}

module.exports.getPostLinkList = async function (
    client,
    nPostId
) {
    const sql = `
        SELECT  pl.id as "linkId"
                , p.id as "targetPostId"
                , p.title as "targetPostTitle"
                , p.content as "targetPostContent"
                , EXTRACT(EPOCH FROM pl.create_date) as "linkCreateDate"

        FROM    post_link pl, post p

        WHERE   pl.target_id = p.id
                and pl.src_id = $1
    `;

    const result = await client.query(sql, [nPostId]);
    return result.rows;
}

module.exports.likeOrDislikePost = async function (
    client,
    nUserId,
    nPostId,
    strLikeType,
) {
    const sql = `
        INSERT INTO user_like_or_dislike_post(user_account_id, post_id, like_type)
        VALUES ($1, $2, $3)
        ON CONFLICT ON CONSTRAINT user_like_or_dislike_post_pkey DO
        UPDATE
        SET like_type = $3, update_date = (now() at time zone 'utc')
    `;

    const result = await client.query(sql, [nUserId, nPostId, strLikeType]);
    
    assert(result.rowCount === 1);
}

module.exports.getPostList = async function (
    client,
    nUserId,
    nNum,
    nOffset
) {
    const sql = `
        SELECT      ${getPostSelectQuery('p', 'ua', nUserId)}
        FROM        post p, user_account ua
        WHERE       p.user_account_id = ua.id and p.is_archived = false
        ORDER BY    p.create_date DESC
        LIMIT       $1
        OFFSET      $2
    `;

    const result = await client.query(sql, [nNum, nOffset]);
    return result.rows;
}

module.exports.createPost = async function (
    client, 
    nUserId,
    nParentIdOrNull,
    strTitle,
    strContent,
) {
    const sql = `
        INSERT INTO post(user_account_id, parent_id, title, content)
        values($1, $2, $3, $4) returning id
    `;

    const result = await client.query(sql, [nUserId, nParentIdOrNull, strTitle, strContent]);
    assert(result.rowCount === 1);
};

module.exports.addOneToNumOfChildren = async function(client, nPostId) {
    const selectQuery = `
        SELECT      num_of_children as "numOfChildren"
        FROM        post
        WHERE       id = $1
    `;

    const selectResult = await client.query(selectQuery, [nPostId]);

    assert(selectResult.rowCount === 1);

    const {numOfChildren} = selectResult.rows[0];

    const updateQuery = `
        UPDATE      post
        SET         num_of_children = $1
        WHERE       id = $2
    `;

    const updateResult = await client.query(updateQuery, [numOfChildren + 1, nPostId]);

    assert(updateResult.rowCount === 1);
}

function getPostSelectQuery(p, ua, userId) {
    const ret = `
        ${p}.id
        , ${p}.user_account_id as "userAccountId"
        , ${ua}.display_name as "userDisplayName"
        
        , ${p}.num_of_children as "numOfChildren"
        , ${p}.title
        , ${p}.content
        , ${p}.category_ids as "categoryIds"
        , ${p}.is_archived as "isArchived"
        , EXTRACT(EPOCH FROM ${p}.create_date) as "createDate"
        , EXTRACT(EPOCH FROM ${p}.update_date) as "updateDate"
        , ${userId === null 
                ? 'null as "likeType"'
                : `COALESCE((
                    SELECT  like_type
                    FROM    user_like_or_dislike_post
                    WHERE   post_id = ${p}.id and user_account_id = ${userId}
                ), null) as "likeType"`
            }
        , ${p}.parent_id as "parentId"
    `;

    return ret;
}

module.exports.getPostDetail = async function(client, nUserId, nPostId) {
    const query = `
        SELECT      ${getPostSelectQuery('p', 'ua', nUserId)}
        FROM        post as p, user_account ua
        WHERE       p.id = $1 and p.user_account_id = ua.id
    `;

    const result = await client.query(query, [nPostId]);  

    assert(result.rowCount === 1);

    return result.rows[0];
}

module.exports.getPostListWithParentId = async function(client, nUserId, nParentId) {
    const query = `
        SELECT      ${getPostSelectQuery('p', 'ua', nUserId)}
        FROM        post as p, user_account as ua
        WHERE       p.parent_id = $1 and p.user_account_id = ua.id
    `;

    const result = await client.query(query, [nParentId]);
    return result.rows;
}

module.exports.canUpdatePost = async function(client, nUserId, nPostId) {
    const sql = `
        SELECT  *
        FROM    post
        WHERE   id = $1 and user_account_id = $2
    `;

    const result = await client.query(sql, [nPostId, nUserId]);
    return result.rows.length === 1;
}

module.exports.archivePost = async function(client, nPostId) {
    const sql = `
        UPDATE  post
        SET     is_archived = true, update_date = (now() at time zone 'utc')
        WHERE   id = $1
    `;

    const result = await client.query(sql, [nPostId]);
    assert(result.rowCount === 1);
}

module.exports.updatePost = async function(client, nPostId, title, content, categoryIds) {
    let sql = `
        UPDATE  post
        SET     update_date = (now() at time zone 'utc')
    `;

    let paramCount = 1;

    const params = [];

    if (typeof title === 'string') {
        sql += `, title = $${paramCount}`;
        params.push(title);
        paramCount++;
    }

    if (typeof content === 'string') {
        sql += `, content = $${paramCount}`;
        params.push(content);
        paramCount++;
    }

    if (Array.isArray(categoryIds) === true) {
        sql += `, category_ids = $${paramCount}`;
        params.push(categoryIds);
        paramCount++;
    }

    sql += `WHERE id = $${paramCount}`
    params.push(nPostId);

    const result = await client.query(sql, params);
    assert(result.rowCount === 1);
}