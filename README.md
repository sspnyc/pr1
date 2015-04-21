##pr1 - Jake's Place
###Jake's own forum where he can discuss topics amongst friends.

_______

[link to wireframe](https://plus.google.com/u/0/107913205914018888023/posts/GprgwbW8Eri?pid=6140083427875504978&oid=107913205914018888023)
###---posts should be formatted in markdown
###---user location should appear in posts
###---topics will be displayed based on popularity/votes
###---The user can:
####*create topics
####*comment on topics
####*see number of comments for each topic
####*vote/click on topics he/she likes
_______
###ERD
##topics

| keys | values |
| ------ | ----------- |
| id  | INTEGER PRIMARY KEY |
| location | VARCHAR |
| description| TEXT |
| votes| INTEGER |

##comments

| keys | values |
| ------ | ----------- |
| id  | INTEGER |
| topic_id | FOREIGN KEY REFERENCES topics(id) |
| content| TEXT |
| location| VARCHAR |
