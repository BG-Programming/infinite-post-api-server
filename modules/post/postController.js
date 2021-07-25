const { utils, error, define }         = require("../libs/stdlib.js" );
const db = require("./dbPost");

module.exports.route = function(api) {
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
 *          - POST LINK
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
async function deletePostLink(userInfo, params) {
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
 *          - POST LINK
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
 *            required: true
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
 *          - POST LINK
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
async function getPostLinkList(userInfo, params) {
    const {postId} = params;

    const nPostId = Number(postId);
    const userId = utils.getUserIdFromUserInfo(userInfo);

    utils.checkRequiredNumberParameter(nPostId);

    return await db.getPostLinkList(userId, nPostId);
}


/**
 * @swagger
 * /api/posts/{postId}/like:
 *  post:
 *      tags:
 *          - POST
 * 
 *      description: 포스트 좋아요(like), 싫어요(dislike), 좋아요 싫어요 취소(null)
 * 
 *      parameters:
 *          - in: path
 *            name: postId
 *            description: 포스트 ID
 *            required: true
 *            schema:
 *              type: integer
 * 
 *          - in: body
 *            required: true
 *            schema:
 *              type: object
 *              required:
 *                  - likeType
 *              properties:
 *                  likeType:
 *                      type: string
 *                      nullable: true
 *                      enum:
 *                          - like
 *                          - dislike
 *                      
 *      responses:
 *          '200':
 *              description: OK
 */
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
 *          - in: query
 *            name: title
 *            description: 포스트 타이틀. 값 존재 시 타이틀로 검색
 *            required: false
 *            schema:
 *              type: string
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
async function getPostList(userInfo, params) {
    const {num, offset, title} = params;
    
    const userId = utils.getUserIdFromUserInfo(userInfo);
    const nNum = Number(num);
    const nOffset = Number(offset);

    utils.checkRequiredNumberParameter(nNum, nOffset);
    utils.checkOptionalStringParameter(title);

    return await db.getPostList(userId, nNum, nOffset, title);
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

/**
 * @swagger
 * /api/post:
 *  post:
 *      tags:
 *          - POST
 * 
 *      description: 포스트 생성
 * 
 *      parameters:
 *          - in: body
 *            required: true
 *            schema:
 *              type: object
 *              required:
 *                  - title
 *              properties:
 *                  title:
 *                      type: string
 *                  content:
 *                      type: string
 *                      nullable: true
 *                  parentId:
 *                      type: integer
 *                      nullable: true
 *                     
 *      responses:
 *          '200':
 *              description: OK
 */
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

/**
 * @swagger
 * /api/posts/{postId}:
 *  put:
 *      tags:
 *          - POST
 * 
 *      description: 포스트 업데이트
 * 
 *      parameters:
 *          - in: path
 *            name: postId
 *            description: 포스트 아이디
 *            required: true
 *            schema:
 *              type: integer
 * 
 *          - in: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      nullable: true
 *                  content:
 *                      type: string
 *                      nullable: true
 *                     
 *      responses:
 *          '200':
 *              description: OK
 */
async function updatePost(userInfo, params, body) {
    const nUserId = userInfo.userId;
    const {postId} = params;
    const {title, content} = body;

    const nPostId = Number(postId);

    utils.checkRequiredNumberParameter(nPostId);
    utils.checkOptionalStringParameter(title, content);

    await db.updatePost(nUserId, nPostId, title, content);
}

/**
 * @swagger
 * /api/posts/{postId}:
 *  delete:
 *      tags:
 *          - POST
 * 
 *      description: 포스트 삭제
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
 *              description: OK
 */
async function deletePost(userInfo, params, _) {
    const nUserId = userInfo.userId;
    const {postId} = params;
    const nPostId = Number(postId);

    utils.checkRequiredNumberParameter(nPostId);

    await db.deletePost(nUserId, nPostId);
}
