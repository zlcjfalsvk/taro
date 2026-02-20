# 타로 카드 가이드

라이더-웨이트 타로 78장의 의미와 해석을 한눈에 볼 수 있는 웹 가이드입니다.

## 주요 기능

- **78장 전체 카드 수록** — 메이저 아르카나 22장 + 마이너 아르카나 56장 (완드, 컵, 소드, 펜타클)
- **정방향/역방향 해석** — 카드별 정방향, 역방향 의미 제공
- **상황별 해석** — 사랑, 직업, 금전, 건강, 창작, Yes/No 질문 등 6가지 상황별 풀이
- **반응형 디자인** — 모바일, 태블릿, 데스크톱 모두 지원
- **접근성** — 키보드 내비게이션, ARIA 레이블 지원

## 기술 스택

- HTML5 / CSS3 / Vanilla JavaScript
- 별도 빌드 과정이나 외부 라이브러리 없이 동작하는 정적 웹앱

## 프로젝트 구조

```
├── index.html          # 메인 HTML
├── css/
│   └── style.css       # 스타일시트
└── js/
    ├── app.js          # 앱 로직 (내비게이션, 모달, 렌더링)
    ├── data.js         # 데이터 통합
    └── data/
        ├── major.js    # 메이저 아르카나 (22장)
        ├── wands.js    # 완드 (14장)
        ├── cups.js     # 컵 (14장)
        ├── swords.js   # 소드 (14장)
        └── pentacles.js # 펜타클 (14장)
```

## 실행 방법

별도 설치 과정 없이 `index.html`을 브라우저에서 열면 바로 사용할 수 있습니다.

로컬 서버를 통해 실행하려면:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

이후 `http://localhost:8000`으로 접속하세요.

## 라이선스

카드 이미지는 [Wikimedia Commons](https://commons.wikimedia.org/)에서 제공됩니다.
