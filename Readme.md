Blog App API - Documentation

App Base Url
http://localhost:4000


Admin User:

email: "admin@mail.com"
userName: "admin"
password: "admin123"

Non-Admin User:

 email: "dummy@mail.com"
 userName: "dummy"
 password: "dummy123"

References:

Endpoints: 
Users

[POST] - "/users/login"
Sample Request Body
{
    "email": "sample@mail.com",
    "password": "samplePw123"
}

[POST] - "/users/register"
Sample Request Body
{
    "email": "sample@mail.com",
    "userName": "sample",
    "password": "samplePw123"
}

Blog
[POST] - "/blogs/createBlog"
Sample Request Body
{
    "title": "Sample: The Movie",
    "content": "Sample Content"
}

[PATCH] - "/blogs/editBlog/:blogId"
Sample Request Body
{
    "title": "Sample edit",
    "content": "Sample edited Content"
}

[DELETE] - "/blogs/deleteBlog/:blogId"
No Request Body

[GET] - "/blogs/blogs"
No Request Body

[GET] - "/blogs/getABlog/:blogId"
No Request Body

[POST] - "/blogs/addComment/:blogId"
Sample Request Body
{
    "comment": "Sample comment"
}

[GET] - "/blogs/getComments/:blogId"
No Request Body

[DELETE] - "/blogs/deleteBlogComments/:blogId"
No Request Body