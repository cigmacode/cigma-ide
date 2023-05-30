![LOGO](./assets/cigma_main.png)

<br>

# Cigma IDE 설치/실행 방법

step 1. 원격 저장소 복제하기

```
$git clone {URL}
```

step 2. 동작에 필요한 node_modules 다운로드

```
$ npm i
```

step 1. project 실행 (reat, file server, crdt websocket, terminal websocket)

```
$ npm run start
```

<br>

## 기본 구성

- 메인 포트 : 5173
  - react
- 서버 포트 : 5000
  - 파일 서버, crdt websocket 서버, terminal websocket 서버 공통
  - crdt websocket 기본 room name : workspace
  - terminal websocket 기본 room name : terminal
- 파일 기본 저장 위치
  - 폴더 바깥 workspace/project
- 사용 라이브러리
  - 기술 스택 Frontend IDE 참고
- 기본 Docker Image
  - caffeincoding/cigma-ide:latest
  - 이미지 구성요소
    - ubuntu 22.04 (base image)
    - Python 3.8.10
    - jdk 11
    - nodejs 18.16.0
    - git

<br>

[사용방법](./user_guide.md)
