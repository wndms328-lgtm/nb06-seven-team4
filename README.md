## Team 4
https://www.notion.so/29ffc892a16f81829db5c63ea7ca2167?source=copy_link
-----
### 팀원 구성
윤정아 (개인 Github 링크)
김지수 (개인 Github 링크)
유인학 (개인 Github 링크)
이주은 (개인 Github 링크)

### 프로젝트 소개
운동 커뮤니티 사이트의 백엔드 시스템 구축
프로젝트 기간: 2025.11.3 ~ 2024.11.20

### 기술 스택
Backend: Express.js, PrismaORM
Database: postgreSQL
공통 Tool: Git & Github, Notion, Discord

-----
### 팀원별 구현 기능 상세
윤정아
(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

example)
소셜 로그인 API
구글 소셜 로그인 API를 활용하여 소셜 로그인 기능을 구현
로그인 후 추가 정보 입력을 위한 API 엔드포인트 개발
회원 추가 정보 입력 API
회원 유형(관리자, 학생)에 따른 조건부 입력 처리 API 구현


김지수
(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

example)
회원별 권한 관리
사용자의 역할에 따라 권한을 설정하는 API 구현
관리자 페이지와 일반 사용자 페이지를 위한 조건부 라우팅 기능 개발
반응형 레이아웃 API
클라이언트에서 전달된 요청에 맞춰 반응형 레이아웃을 위한 API 엔드포인트 구현


유인학
(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

수강생 정보 관리 API
fetch(GET)을 사용하여 학생의 수강 정보를 조회하는 API 엔드포인트 개발
수강 정보의 반응형 UI 구성
공용 Button API
공통으로 사용할 버튼 기능을 처리하는 API 구현


이주은
(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

관리자 API
Path Parameter를 활용한 동적 라우팅 기능 구현
fetch(PATCH, DELETE)를 사용하여 학생 정보를 수정하고 탈퇴하는 API 엔드포인트 개발
CRUD 기능
학생 정보 CRUD 기능을 제공하는 API 구현
회원관리 슬라이더
학생별 정보 목록을 carousel 방식으로 보여주는 API 개발


### 파일 구조
src
 ┣ config
 ┃ ┗ db.ts
 ┣ controllers
 ┃ ┣ auth.controller.ts
 ┃ ┗ user.controller.ts
 ┣ middleware
 ┃ ┣ auth.middleware.ts
 ┃ ┗ error.middleware.ts
 ┣ models
 ┃ ┣ user.model.ts
 ┃ ┗ course.model.ts
 ┣ routes
 ┃ ┣ auth.routes.ts
 ┃ ┗ user.routes.ts
 ┣ services
 ┃ ┣ auth.service.ts
 ┃ ┗ user.service.ts
 ┣ utils
 ┃ ┣ jwt.ts
 ┃ ┣ constants.ts
 ┃ ┗ logger.ts
 ┣ main.js
 ┗ server.ts
prisma
 ┣ schema.prisma
 ┗ seed.ts
.env
.gitignore
package.json
tsconfig.json
README.md


### 구현 홈페이지
(개발한 홈페이지에 대한 링크 게시)

https://www.codeit.kr/


### 프로젝트 회고록
(제작한 발표자료 링크 혹은 첨부파일 첨부)

