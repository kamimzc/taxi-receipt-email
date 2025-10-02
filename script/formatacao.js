
/*formatação do telefone*/
document.getElementById("telefone").addEventListener("input", function (e) {
  let valor = e.target.value.replace(/\D/g, ""); // só números
  if (valor.length > 11) valor = valor.slice(0, 11); // limita a 11 dígitos
  
  if (valor.length <= 10) {
    /*p numero fixo*/
    valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else {
    /*p numero celular*/
    valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }
  
  e.target.value = valor;
});

/*formatação do valor*/
document.getElementById("valor").addEventListener("input", function (e) {
  let valor = e.target.value.replace(/\D/g, ""); // só números
  valor = (valor/100).toFixed(2) + ""; // divide por 100 e força 2 casas decimais
  valor = valor.replace(".", ","); // vírgula como separador decimal
  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // separador de milhar
  e.target.value = "R$ " + valor;
});

/*formatação do CPF*/
document.getElementById("cpf").addEventListener("input", function (e) {
  let valor = e.target.value.replace(/\D/g, ""); // mantém só números
  if (valor.length > 11) valor = valor.slice(0, 11); // limita a 11 dígitos

  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  e.target.value = valor;
});
