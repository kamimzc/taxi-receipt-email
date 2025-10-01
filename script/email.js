emailjs.init("VWEv3xUnqizxBrP-F");

function getComprovanteData() {
    return {
        nome: document.querySelector("#nome").value,
        cpf: document.querySelector("#cpf").value,
        email: document.querySelector("#email").value,
        telefone: document.querySelector("#telefone").value,
        data: document.querySelector("#data").value || new Date().toISOString(),
        origem: document.querySelector("#origem").value,
        destino: document.querySelector("#destino").value,
        pagamento: document.querySelector("#pagamento").value,
        valor: document.querySelector("#valor").value
    };
}

function updateComprovanteUI(data) {
    const dataFormatada = new Date(data.data).toLocaleString("pt-BR");
    
    document.querySelector("#pdf-nome").textContent = data.nome;
    document.querySelector("#pdf-cpf").textContent = data.cpf;
    document.querySelector("#pdf-email").textContent = data.email;
    document.querySelector("#pdf-telefone").textContent = data.telefone;
    document.querySelector("#pdf-data").textContent = dataFormatada;
    document.querySelector("#pdf-origem").textContent = data.origem;
    document.querySelector("#pdf-destino").textContent = data.destino;
    document.querySelector("#pdf-pagamento").textContent = data.pagamento;
    document.querySelector("#pdf-valor").textContent = data.valor;

    document.getElementById("comprovante-pdf").style.display = "block";
}

function baixarPDF() {
    const element = document.getElementById("comprovante-pdf");
    const opt = {
        margin: 10,
        filename: "comprovante.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
}

function enviarEmail() {
    const data = getComprovanteData();
    updateComprovanteUI(data);

    const emailData = {
        nome: data.nome,
        cpf: data.cpf,
        email: data.email,
        telefone: data.telefone,
        data: new Date(data.data).toLocaleString("pt-BR"),
        origem: data.origem,
        destino: data.destino,
        pagamento: data.pagamento,
        valor: data.valor
    };

    emailjs.send("service_f81ljjf", "template_29nrnva", emailData)
        .then(() => alert("✅ Comprovante enviado por e-mail!"))
        .catch(err => {
            console.error("Erro:", err);
            alert("❌ Erro ao enviar comprovante.");
        });
}

function entrarNaConversa() {
    const telefone = document.querySelector("#telefone").value.replace(/\D/g, "");
    if (!telefone) return alert("Por favor, insira um telefone válido.");
    window.open(`https://wa.me/${telefone}`, "_blank");
}

document.getElementById("btn-comprovante").addEventListener("click", () => {
    const data = getComprovanteData();
    updateComprovanteUI(data);
    baixarPDF();
});

document.getElementById("btn-email").addEventListener("click", enviarEmail);
document.getElementById("btn-conversa").addEventListener("click", entrarNaConversa);
