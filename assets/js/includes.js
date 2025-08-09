function includeHTML() {
  const elements = document.querySelectorAll('[include-html]');
  elements.forEach(el => {
    const file = el.getAttribute("include-html");
    if (file) {
      fetch(file)
        .then(res => {
          if (!res.ok) throw new Error(`Erro ao carregar ${file}`);
          return res.text();
        })
        .then(data => {
          el.innerHTML = data;
          el.removeAttribute("include-html");
          includeHTML(); // Caso o conteúdo incluído também use includes
        })
        .catch(err => {
          el.innerHTML = "<p>Conteúdo não encontrado.</p>";
          console.error(err);
        });
    }
  });
}

document.addEventListener("DOMContentLoaded", includeHTML);