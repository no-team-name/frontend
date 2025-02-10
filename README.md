# ACCORD
![accord-removebg.png](./docs/accord-removebg.png)

### 개발자들을 위한 온라인 협업툴

# 목차
1. 팀원 소개 및 역할
2. 사용 기술 스택
3. 도메인 및 API 명세
4. 프로젝트 개발 일정
5. 아키텍쳐
6. 플로우차트
7. ERD

# 팀원 소개 및 역할
<table>
<thead>
<tr>
<th style="text-align: center;">이름</th>
<th style="text-align: center;">역할</th>
<th style="text-align: center;">담당 업무</th>
<th style="text-align: center;">이메일</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;"><b>박유빈</b></td>
<td style="text-align: center;">팀장 <br> Backend/Frontend</td>
<td style="text-align: center;">
<b><br><br>#설계</b><br>- Figma 설계<br>- ERD 설계<br><br>
<b>#Backend</b>
<b>#Frontend</b>
</td>
<td style="text-align: center;"><a href="mailto:hazing0910@gmail.com">hazing0910@gmail.com</a></td>
</tr>
<tr>
<td style="text-align: center;"><b>정석환</b></td>
<td style="text-align: center;">팀원 <br> Backend/Frontend</td>
<td style="text-align: center;">
<b><br><br>#설계</b><br>- Figma 설계<br>- ERD 설계<br><br>
<b>#Backend</b>
<b>#Frontend</b>
</td>
<td style="text-align: center;"><a href="mailto:jsver12@gmail.com">jsver12@gmail.com</a></td>
</tr>
<tr>
<td style="text-align: center;"><b>최요셉</b></td>
<td style="text-align: center;">팀원 <br> Backend/Frontend</td>
<td style="text-align: center;">
<b><br><br>#설계</b><br>- Figma 설계<br>- ERD 설계<br><br>
<b>#Backend</b>
<b>#Frontend</b>
</td>
<td style="text-align: center;"><a href="mailto:aslopeys941@gmail.com">aslopeys941@gmail.com</a></td>
</tr>
<tr>
<td style="text-align: center;"><b>심윤보</b></td>
<td style="text-align: center;">팀원 <br> Backend/Frontend</td>
<td style="text-align: center;">
<b><br><br>#설계</b><br>- Figma 설계<br>- ERD 설계<br><br>
<b>#Backend</b>
<b>#Frontend</b>
</td>
<td style="text-align: center;"><a href="mailto:ensoary@gmail.com">ensoary@gmail.com</a></td>
</tr>
<tr>
<td style="text-align: center;"><b>이시현</b></td>
<td style="text-align: center;">팀원 <br> Backend/Frontend</td>
<td style="text-align: center;">
<b><br><br>#설계</b><br>- Figma 설계<br>- ERD 설계<br><br>
<b>#Backend</b>
<b>#Frontend</b>
</td>
<td style="text-align: center;"><a href="mailto:tlgus7777@gmail.com">tlgus7777@gmail.com</a></td>
</tr>
</tbody>
</table>
<br>
<br>


# 사용 기술 스택
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=Spring&logoColor=white">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=Java&logoColor=white">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=Go&logoColor=white">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
  <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=MariaDB&logoColor=white">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=MongoDB&logoColor=white">
  <img src="https://img.shields.io/badge/AWS%20S3-569A31?style=for-the-badge&logo=Amazon%20S3&logoColor=white">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black">
  <img src="https://img.shields.io/badge/WebRTC-1E90FF?style=for-the-badge&logo=WebRTC&logoColor=white">
  <img src="https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=Prometheus&logoColor=white">
  <img src="https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=Grafana&logoColor=white">
  <img src="https://img.shields.io/badge/gRPC-4285F4?style=for-the-badge&logo=gRPC&logoColor=white">
  <img src="https://img.shields.io/badge/Consul-593D88?style=for-the-badge&logo=Consul&logoColor=white">
</div>
<br>
<br>

# 도메인 및 API 명세
https://accord.my/
<br>
<details>
<summary>
  API 명세서 Swagger ver.
</summary>
  
  ![accordswagger.png](./docs/accordswagger.png)
  
</details>

## 팀관리 (위임 및 권한 관련 API)

| Method | Endpoint                                        | Description                   |
|--------|-------------------------------------------------|-------------------------------|
| **GET**    | `/api/teams/{teamId}`                             | 팀 조회                        |
| **PUT**    | `/api/teams/{teamId}`                             | 팀 이름 수정                    |
| **DELETE** | `/api/teams/{teamId}`                             | 팀 삭제                        |
| **POST**   | `/api/members/teams`                              | 팀 생성                        |
| **POST**   | `/api/members/teams/members/{teamId}`             | 팀에 구성원 등록                |
| **GET**    | `/api/members/teams/{memberId}`                   | 특정 회원의 팀 목록 조회         |
| **GET**    | `/api/members/team-members/{teamId}/{memberId}`    | 팀원 상세 조회 또는 초대 확인       |
| **GET**    | `/api/members/team-members/search`                 | 팀 멤버 검색                    |

---

## 조인보드 (가입 게시판) API

| Method | Endpoint                  | Description                 |
|--------|---------------------------|-----------------------------|
| **GET**    | `/api/join-board/{joinBoardId}`      | 가입 게시판 게시글 상세 조회        |
| **PUT**    | `/api/join-board/{joinBoardId}`       | 게시글 수정                         |
| **DELETE** | `/api/join-board/{joinBoardId}`       | 게시글 삭제                         |
| **GET**    | `/api/join-board`                     | 가입 게시판 전체 게시글 조회        |
| **POST**   | `/api/join-board`                     | 게시글 생성                         |
| **POST**   | `/api/join-board/search`              | 게시판 내 글 검색                   |
| **GET**    | `/api/join-board/sort-by=title`       | 게시글 제목 기준 정렬 조회            |

### 댓글(코멘트) 관련

| Method | Endpoint                | Description         |
|--------|-------------------------|---------------------|
| **PUT**    | `/api/comment/{commentId}`        | 댓글 수정            |
| **DELETE** | `/api/comment/{commentId}`        | 댓글 삭제            |
| **GET**    | `/api/comment/{joinBoardId}`      | 댓글 조회            |
| **POST**   | `/api/comment/{joinBoardId}`      | 댓글 작성            |
| **GET**    | `/api/joinBoard/{joinBoardId}/comment/{commentId}` | 특정 댓글 또는 대댓글 조회 |

---

## 회원정보관리 (닉네임 변경 및 회원정보 조회 API)

| Method | Endpoint                      | Description         |
|--------|-------------------------------|---------------------|
| **PATCH** | `/api/member/nicknames`          | 닉네임 변경            |
| **GET**    | `/api/member/userinfos`          | 회원(유저) 정보 조회     |
| **GET**    | `/api/member/profiles`           | 회원 프로필 조회         |

---

## 팀 캔버스 (파일 업로드 등) API

| Method | Endpoint                  | Description             |
|--------|---------------------------|-------------------------|
| **POST**   | `/api/images/canvases`        | 캔버스 파일 업로드(저장)  |
| **GET**    | `/api/images/canvases`         | 캔버스 파일 조회           |
| **DELETE** | `/api/images/canvases`         | 캔버스 파일 삭제           |

---

## 관리자(Admin) API

| Method | Endpoint                                         | Description        |
|--------|--------------------------------------------------|--------------------|
| **PUT**    | `/api/admin/members/{memberId}/status`           | 회원 상태 변경        |
| **GET**    | `/api/admin/members/search`                      | 회원 검색            |
| **GET**    | `/api/admin/boards/{boardId}/boards`             | 특정 보드(게시글) 조회 |
| **DELETE** | `/api/admin/boards/{boardId}`                    | 보드(게시글) 삭제     |
| **DELETE** | `/api/admin/boards/{boardId}/ban`                | 게시글 차단, 제재     |

---

## 프로필이미지 (Profile Image) API

| Method | Endpoint                          | Description         |
|--------|-----------------------------------|---------------------|
| **POST**   | `/api/members/profile-images`      | 프로필 이미지 등록    |
| **DELETE** | `/api/members/profile-images`      | 프로필 이미지 삭제    |

---

## 채팅 API

| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| **POST**   | `/api/chat/messages`     | 채팅 메시지 전송하기    |

---

## 팀 노트 API

| Method | Endpoint              | Description  |
|--------|-----------------------|--------------|
| **POST**   | `/api/members/notes`        | 팀 노트 생성      |
| **DELETE** | `/api/members/notes`        | 팀 노트 삭제      |

---

## 인증 관리 (JWT/토큰 등)

| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| **POST**   | `/api/auth/reissue`    | 토큰 재발급          |
| **POST**   | `/api/auth/logout`     | 로그아웃              |
| **DELETE** | `/api/auth`            | 회원 탈퇴 혹은 인증 취소 |

---

## 칸반보드 (Kanban Board) API

| Method | Endpoint                          | Description                     |
|--------|-----------------------------------|---------------------------------|
| **PUT**    | `/api/kanbanboardcard/update`     | 카드 내용 변경                    |
| **PUT**    | `/api/kanbanboard/update`         | 칸반보드(보드) 수정               |
| **POST**   | `/api/kanbanboardcard/switch`     | 카드 스위치(컬럼 간 이동 등)       |
| **POST**   | `/api/kanbanboardcard/create`     | 카드 생성                         |
| **POST**   | `/api/kanbanboard/switch`         | 칸반보드 스위치                  |
| **POST**   | `/api/kanbanboard/create`         | 칸반보드 생성                     |
| **GET**    | `/api/kanbanboard/{teamId}`       | 칸반보드 조회                     |
| **DELETE** | `/api/kanbanboardcard/delete`     | 카드 삭제                         |
| **DELETE** | `/api/kanbanboard/delete`         | 칸반보드 삭제                     |

---

<br>

# 개발일정

<br>

# 아키텍쳐
![architecture.png](./docs/architecture.png)


# 플로우차트
![flow.png](./docs/flow.png)

# ERD
![erd.png](./docs/erd.png)
![mongodb.png](./docs/mongodb.png)
