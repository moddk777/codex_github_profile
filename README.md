# GitHub Pages Bilingual Portfolio (KO/EN)

정적 `HTML/CSS/JS`로 만든 한/영 이중언어 포트폴리오 템플릿입니다.  
언어 전환은 `KO | EN` 토글로 동작하며, 선택한 언어는 브라우저에 저장됩니다.

## File Overview
- `index.html`: 섹션 구조, 언어 토글 UI, 렌더 대상 마크업(`data-i18n`)
- `styles.css`: 반응형 스타일, 토글 활성 상태, 진입 애니메이션
- `content.js`: 다국어 콘텐츠 사전(`CONTENT.ko`, `CONTENT.en`)
- `app.js`: `applyLanguage(lang)` 렌더링 + `localStorage` 저장/복원

## Language Data Schema
두 언어는 동일한 키 구조를 유지해야 합니다.

```js
CONTENT.ko = {
  profile: { name, role, intro },
  about: { body },
  experience: [{ org, role, period, summary }],
  projects: [{ title, summary, tech, link, period }],
  contact: { email, github, linkedin },
  ui: { ... } // 섹션 제목, 버튼 텍스트 등
};
```

동일한 구조를 `CONTENT.en`에도 유지하세요.  
누락된 키는 자동으로 한국어(`ko`) 값으로 fallback 됩니다.

## Local Preview
```bash
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080` 접속 후 다음을 확인하세요.
- 첫 로드 기본 언어가 한국어인지
- `EN` 클릭 시 전체 섹션이 영문으로 전환되는지
- 새로고침 후 마지막 선택 언어가 유지되는지

## GitHub Pages Deploy (GitHub Actions)
1. 저장소 `Settings > Pages`에서 `Source`를 `GitHub Actions`로 설정
2. 이 저장소의 `.github/workflows/deploy-pages.yml`이 `main` push 시 자동 배포 수행
3. `Actions` 탭에서 `Deploy GitHub Pages` 워크플로 성공 여부 확인
4. 배포 URL 확인: `https://<github-username>.github.io/<repo-name>/`

## Content Update Guide
- 프로필 정보: `content.js > profile`
- 이력: `content.js > experience` 배열 항목 추가/수정
- 프로젝트: `content.js > projects` 배열 항목 추가/수정
- 연락 링크: `content.js > contact` URL 및 이메일 수정

텍스트만 수정하면 렌더링은 자동 반영됩니다.
