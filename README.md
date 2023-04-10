<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# You App Backend Test

A brief description of what this project does and who it's for

challenge:
- Challenge A : CRUD
- Challenge B : Websocket (without Kafka, reason: my machine does not have kafka, installing and set it up takes time. I can do it anyway)

resulting `RFC7807` format as follows \
all error resulting `400`, created resulting `201` \
all success resulting `200`

use [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) on vsCode to test the API\
endpoint testpoint included on `thunder` folder

Menus:
- [Api Refrence Utility](#api-refrence-utility)
- [Api Refrence Profile and Auth](#api-reference-profile-and-auth)
- [Api Refrence Chat](#api-reference-chats)

## API Refrence Utility

#### File Upload

```http
POST /utility/file-upload
```
Header:
| | |
|---|---|
| Content-Type | multipart/form-data |
| Authorization | Bearer token |

Body:
| | |
|---|---|
| file | `open file` |

Response:
```json
Content-Type: application/json

{
  "statusCode": 200,
  "message": null,
  "data": {
    "originalname": "Screenshot 2023-04-09 at 04.26.30.png",
    "filename": "8d540d50-43ab-4f85-a900-ae6ac33ed3cb.png"
  }
}
```

## API Reference Profile and Auth

#### Register

```http
POST /users/register
```

```json
Content-Type: application/json

{
  "name":"zonblade",
  "username":"hehe",
  "password":"testing",
  "email":"testing@test.te"
}
```
Response:
```json
HTTP_HEADER: 201 (Created)
Content-Type: application/json

{
  "statusCode": 201,
  "message": null,
  "data": {
    "token": "token here"
  }
}
```

#### Login

```http
GET /users/login
```

```json
Content-Type: application/json

{
    "username": "string",
    "password": "string"
}
```
Response:
```json
HTTP_HEADER: 200 (OK)
Content-Type: application/json

{
  "statusCode": 200,
  "message": null,
  "data": {
    "token": "token here"
  }
}
```

#### Update Profile

```http
PATCH /users
Authorization: Bearer token
```

```json
Content-Type: application/json

{
    "name": "string", // optional
    "username": "string", // optional
    "email": "string", // optional
    "image": [  // optional
        "string",
        "string"
    ]
}
```
Response:
```json
HTTP_HEADER: 200 (OK)
Content-Type: application/json

{
  "statusCode": 200,
  "message": null,
  "data": null
}
```

#### Get User List

```http
GET /users?search=type something
Authorization: Bearer token
```
Response:
```json
HTTP_HEADER: 200 (OK)
Content-Type: application/json

{
  "statusCode": 200,
  "message": null,
  "data": [
    {
      "id": "6432fcc07f16ab38269fa91b",
      "name": "zonblade",
      "username": "string",
      "image": [],
      "prefrences": {
        "horoscope": null,
        "zodiac": null,
        "height": 0,
        "weight": 0,
        "interest": [],
        "about": null
      }
    }
  ]
}
```

#### Get User Data

```http
GET /users/${id}
Authorization: Bearer token
```
Response:
```json
HTTP_HEADER: 200 (OK)
Content-Type: application/json

{
  "statusCode": 200,
  "message": null,
  "data": {
    "id": "6432fcc07f16ab38269fa91b",
    "name": "zonblade",
    "username": "string",
    "image": [],
    "prefrences": {
      "horoscope": null,
      "zodiac": null,
      "height": 0,
      "weight": 0,
      "interest": [],
      "about": null
    }
  }
}
```
---


## API Reference Chats


#### (HTTP) Get Chat List

```http
GET /chats
Authorization: Bearer token
```
Response:
```json
HTTP_HEADER: 200 (OK)
Content-Type: application/json

{
  "statusCode": 200,
  "message": null,
  "data": [
    {
      "id": "64333e0dc57ff31598bae585",
      "username": "string2",
      "name": "string2",
      "image": [],
      "last_message": ""
    }
  ]
}
```


#### (HTTP) Get Chat History (Internal)

```http
GET /chats/${id}
Authorization: Bearer token
```
Response:
```json
HTTP_HEADER: 200 (OK)
Content-Type: application/json

{
  "statusCode": 200,
  "message": null,
  "data": [
    {
      "id": "6433483d125981d7bd5170b1",
      "message": "hy",
      "date": "2023-04-09T23:20:29.000Z",
      "itsMe": true
    }
  ]
}
```

### (SOCKET.IO) Connecting
```http
ENDPOINT http://ip_or_domain:port?target=${target}&jwt=${token}
```

| param | desc |
|---|---|
| target | user_id of user you'd want to chat. |
| jwt | your token without `Bearer`|

### (SOCKET.IO) Sending message
```json
EVENT: message

{
    "message":"hello",
    "image":"some.png"
}
```
Response:
```json
EVENT: message

{
    "user_id":"string id", // to determine which one is which
    "message":"hello",
    "image":"some.png"
}
```

### (SOCKET.IO) Typing...

used to determine this room has user typing.
```json
EVENT: message.typing
```