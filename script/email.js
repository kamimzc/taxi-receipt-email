import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser/dist/email.min.js";

emailjs.init("VWEv3xUnqizxBrP-F"); // Public Key EmailJS

function emitirComprovante() {
    const nome = document.querySelector("#nome").value;
    const email = document.querySelector("#email").value;
    const valor = document.querySelector("#valor").value;
    const dataInput = document.querySelector("#data").value;
    const data = dataInput ? new Date(dataInput).toLocaleString("pt-BR") : new Date().toLocaleString("pt-BR");

    document.querySelector("#pdf-nome").textContent = nome;
    document.querySelector("#pdf-data").textContent = data;
    document.querySelector("#pdf-valor").textContent = valor;

    const element = document.getElementById("comprovante-pdf");
    element.style.display = "block";

    html2pdf()
        .from(element)
        .set({
            margin: 10,
            filename: "comprovante.pdf",
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        })
        .outputPdf('blob')
        .then(pdfBlob => {
            const pdfURL = URL.createObjectURL(pdfBlob);
            enviarEmail(nome, email, valor, data, pdfURL);
        })
        .catch(err => {
            console.error("Erro ao gerar PDF:", err);
            alert("Erro ao gerar comprovante.");
        });
}

function enviarEmail(nome, email, valor, data, link_pdf) {
    const dados = {
        nome,
        email,
        data,
        valor,
        link_pdf
    };

    emailjs.send("service_f81ljjf", "template_29nrnva", dados)
        .then(response => {
            console.log("Email enviado com sucesso!", response.status, response.text);
            alert("Comprovante enviado por email!");
        })
        .catch(error => {
            console.error("Erro ao enviar email:", error);
            alert("Erro ao enviar comprovante.");
        });
}

function entrarNaConversa() {
    const telefone = document.querySelector("#telefone").value.replace(/\D/g, "");
    if (!telefone) {
        alert("Por favor, insira um telefone válido.");
        return;
    }
    window.open(`https://wa.me/${telefone}`, "_blank");
}

window.emitirComprovante = emitirComprovante;
window.enviarEmail = () => {
    emitirComprovante(); // Pode reutilizar
};
window.entrarnaConversa = entrarNaConversa;

document.getElementById("btn-comprovante").addEventListener("click", emitirComprovante);
document.getElementById("btn-email").addEventListener("click", () => emitirComprovante());
document.getElementById("btn-conversa").addEventListener("click", entrarNaConversa);
