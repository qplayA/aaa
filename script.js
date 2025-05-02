
document.addEventListener("DOMContentLoaded", () => {
  let data = [];

  // normalize: 영어 대소문자 무시, 공백 제거
  const normalize = str => str.toLowerCase().replace(/\s+/g, "").trim();

  // 하이라이트 함수 (질문/정답 구분)
  const highlight = (text, terms, className) => {
    let highlighted = text;
    terms.forEach(term => {
      const regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      highlighted = highlighted.replace(regex, '<span class="' + className + '">$1</span>');
    });
    return highlighted;
  };

  // 검색 실행 함수
  function runSearch(query) {
    const terms = query.split(/\s+/).filter(Boolean).map(normalize);
    const results = data.filter(q =>
      terms.every(term =>
        q._nq.includes(term) || q._na.includes(term)
      )
    );

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    results.forEach(q => {
      const div = document.createElement("div");
      div.className = "result";
      div.innerHTML =
        "<h3>" + highlight(q.question, terms, 'highlight-question') + "</h3>" +
        "<p>" + highlight(q.answer, terms, 'highlight-answer') + "</p>";
      resultsDiv.appendChild(div);
    });
  }

  // debounce 함수: 입력 후 일정 시간 지나야 실행
  function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }

  const debouncedSearch = debounce((e) => {
    runSearch(e.target.value);
  }, 300);

  fetch("data.json")
    .then(res => res.json())
    .then(json => {
      data = json.map(q => ({
        ...q,
        _nq: normalize(q.question),
        _na: normalize(q.answer)
      }));
    });

  const input = document.getElementById("search");
  input.addEventListener("input", debouncedSearch);
});
