CREATE TABLE "user_account" (
    "id"            serial        primary key,
    "nickname"      varchar(30)   not null unique,
    "email"         varchar(100)  not null unique,
    "pw"            varchar(100)  not null,
    "is_archived"   boolean       not null default false,
    "create_date"   timestamp     without time zone not null default (now() at time zone 'utc')
  );
  
  CREATE TABLE "post" (
    "id"                        serial        primary key,
    "user_account_id"           integer       not null references "user_account"(id),
    "parent_id"                 integer       references "post"(id),
    "num_of_children"           integer       not null default 0,
    "title"                     varchar(100)  not null,
    "content"                   text,
    "category_ids"              int[]         not null default '{}',
    "is_archived"               boolean       not null default false,
    "create_date"               timestamp     without time zone not null default (now() at time zone 'utc'),
    "update_date"               timestamp     without time zone
  );
  
  CREATE TABLE "post_category" (
    "id"            serial        primary key,
    "name"          varchar(50)   not null,
    "is_archived"   boolean       not null default false,
    "create_date"   timestamp     without time zone not null default (now() at time zone 'utc')
  );
  
  create type like_type as enum ('like', 'dislike');
  
  CREATE TABLE "user_like_or_dislike_post" (
    "user_account_id"       int           references "user_account"(id),
    "post_id"               int           references post(id),
    "like_type"             like_type     not null,
  
    "create_date"           timestamp     without time zone not null default (now() at time zone 'utc'),
  
    primary key("user_account_id", "post_id")
  );

  
  CREATE TABLE "user_read_post" (
    "user_account_id"         int   references "user_account"(id),
    "post_id"                 int   references "post"(id),
    "last_view_date"          timestamp,
  
    primary key("user_account_id", "post_id")
  );

  insert into post(user_account_id, parent_id, title) values (NULL, NULL, 'ROOT POST');