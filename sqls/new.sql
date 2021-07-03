
CREATE TABLE "post_link" (
    "id"            serial          primary key,
    "src_id"        int             references "post"(id),
    "target_id"     int             references "post"(id),
    "create_date"   timestamp       without time zone not null default (now() at time zone 'utc'),
  
    unique("src_id", "target_id")
);