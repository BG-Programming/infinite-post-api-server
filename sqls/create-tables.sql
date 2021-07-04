  CREATE TABLE "user_account" (
    "id"            serial        primary key,
    "user_name"     varchar(30)   not null unique,
    "display_name"  varchar(128)  not null,
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
    "like_type"             like_type,
  
    "create_date"           timestamp     without time zone not null default (now() at time zone 'utc'),
    "update_date"           timestamp     without time zone,
    primary key("user_account_id", "post_id")
  );

  
  CREATE TABLE "user_read_post" (
    "user_account_id"         int   references "user_account"(id),
    "post_id"                 int   references "post"(id),
    "last_view_date"          timestamp,
  
    primary key("user_account_id", "post_id")
  );

  CREATE TABLE "post_link" (
    "id"            serial          primary key,
    "src_id"        int             references "post"(id),
    "target_id"     int             references "post"(id),
    "create_date"   timestamp       without time zone not null default (now() at time zone 'utc'),
  
    unique("src_id", "target_id")
  );