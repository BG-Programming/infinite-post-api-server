const { utils, error, define }         = require("../libs/stdlib.js" );
const db = require("./dbPost");

module.exports.route = function(api, app) {
    api.get('/api/posts/:postId/links',             getPostLinkList);
    api.post('/api/posts/:postId/link',             createPostLink);
    api.delete('/api/posts/:postId/links/:linkId',  deletePostLink);
    
    api.guest.get('/api/posts/:num/:offset',        getPostList);
    api.guest.get('/api/posts/:postId',             getPostDetail);

    api.post('/api/post',                           createPost);
    api.put('/api/posts/:postId',                   updatePost);
    api.delete('/api/posts/:postId',                deletePost);
    api.post('/api/posts/:postId/like',             likeOrDislikePost);
};

/**
 * @swagger
 * /api/posts/{postId}/links/{linkId}:
 *  delete:
 *      tags:
 *          - POST
 * 
 *      description: 포스트 링크 삭제
 * 
 *      parameters:
 *          - in: path
 *            name: postId
 *            description: 소스 포스트 ID
 *            required: true
 *            schema:
 *              type: integer
 *          - in: path
 *            name: linkId
 *            description: 삭제할 링크 ID
 *            required: true
 *            schema: 
 *              type: integer
 * 
 *      responses:
 *          '200':
 *              description: OK
 */
async function deletePostLink(userInfo, params, body) {
    const {postId, linkId} = params;
    const userId = utils.getUserIdFromUserInfo(userInfo);

    const nPostId = Number(postId);
    const nLinkId = Number(linkId);

    utils.checkRequiredNumberParameter(nPostId, nLinkId);

    await db.deletePostLink(userId, nPostId, nLinkId);
}

/**
 * @swagger
 * /api/posts/{postId}/link:
 *  post:
 *      tags:
 *          - POST
 * 
 *      description: 포스트 링크 생성
 * 
 *      parameters:
 *          - in: path
 *            name: postId
 *            description: 소스 포스트 ID
 *            required: true
 *            schema:
 *              type: integer
 * 
 *          - in: body
 *            schema:
 *              type: object
 *              required:
 *                  - targetPostId
 *              properties:
 *                  targetPostId:
 *                      type: integer
 *                      
 *      responses:
 *          '200':
 *              description: OK
 */
async function createPostLink(userInfo, params, body) {
    const {postId} = params;
    const {targetPostId} = body;

    const nPostId = Number(postId);
    const nTargetPostId = Number(targetPostId);

    const userId = utils.getUserIdFromUserInfo(userInfo);

    utils.checkRequiredNumberParameter(nPostId, nTargetPostId);

    await db.createPostLink(userId, nPostId, nTargetPostId);
}

/**
 * @swagger
 * /api/posts/{postId}/links:
 *  get:
 *      tags:
 *          - POST
 * 
 *      description: 포스트 링크 리스트
 * 
 *      parameters:
 *          - in: path
 *            name: postId
 *            description: 소스 포스트 ID
 *            required: true
 *            schema:
 *              type: integer
 *                      
 *      responses:
 *          '200':
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/PostLink'
 */
async function getPostLinkList(userInfo, params, body) {
    const {postId} = params;

    const nPostId = Number(postId);
    const userId = utils.getUserIdFromUserInfo(userInfo);

    utils.checkRequiredNumberParameter(nPostId);

    return await db.getPostLinkList(userId, nPostId);
}

async function likeOrDislikePost(userInfo, params, body) {
    const {postId} = params;
    const {likeType} = body;
    const userId = utils.getUserIdFromUserInfo(userInfo);
    const nPostId = Number(postId);
    
    utils.checkRequiredNumberParameter(nPostId);
    utils.checkOptionalStringParameter(likeType);

    if (likeType !== null && (likeType === undefined || define.postLikeType.isValid(likeType) === false)) {
        throw error.newInstanceInvalidParameter();
    }

    await db.likeOrDislikePost(userId, nPostId, likeType);
}

/**
 * @swagger
 * /api/posts/{num}/{offset}:
 *  get:
 *      tags:
 *          - POST
 * 
 *      description: 포스트 리스트 조회
 * 
 *      parameters:
 *          - in: path
 *            name: num
 *            description: 반환할 리스트 갯수
 *            required: true
 *            schema:
 *              type: integer
 *          - in: path
 *            name: offset
 *            description: 리스트 조회 시작지점
 *            required: true
 *            schema: 
 *              type: integer
 * 
 *      responses:
 *          '200':
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Post'
 */
async function getPostList(userInfo, params, body) {
    const {num, offset} = params;
    
    const userId = utils.getUserIdFromUserInfo(userInfo);
    const nNum = Number(num);
    const nOffset = Number(offset);

    utils.checkRequiredNumberParameter(nNum, nOffset);

    return await db.getPostList(userId, nNum, nOffset);
}


/**
 * @swagger
 * /api/posts/{postId}:
 *  get:
 *      tags:
 *          - POST
 * 
 *      description: 포스트 상세 조회
 * 
 *      parameters:
 *          - in: path
 *            name: postId
 *            description: 포스트 아이디
 *            required: true
 *            schema:
 *              type: integer
 * 
 *      responses:
 *          '200':
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Post'
 */
async function getPostDetail(userInfo, params, _) {
    const {postId} = params;

    const userId = utils.getUserIdFromUserInfo(userInfo);
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
    const nUserId = userInfo.userId;
    const {postId} = params;
    const {title, content, categoryIds} = body;

    const nPostId = Number(postId);

    utils.checkRequiredNumberParameter(nPostId);
    utils.checkOptionalStringParameter(title, content);
    utils.checkOptionalNumberArrayParameter(categoryIds);

    await db.updatePost(nUserId, nPostId, title, content, categoryIds);
}

async function deletePost(userInfo, params, _) {
    const nUserId = userInfo.userId;
    const {postId} = params;
    const nPostId = Number(postId);

    utils.checkRequiredNumberParameter(nPostId);

    await db.deletePost(nUserId, nPostId);
}
