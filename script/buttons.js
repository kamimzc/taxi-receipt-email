emailjs.init("VWEv3xUnqizxBrP-F");

function getComprovanteData() {
    const campos = ["nome", "cpf", "email", "telefone", "data", "origem", "destino", "pagamento", "valor"];
    const data = {};
    campos.forEach(campo => {
        data[campo] = document.querySelector(`#${campo}`)?.value || "";
    });
    return data;
}

   function updateComprovanteUI(data) {
    const camposUI = {
        nome: "#pdf-nome",
        cpf: "#pdf-cpf",
        email: "#pdf-email",
        telefone: "#pdf-telefone",
        data: "#pdf-data",
        origem: "#pdf-origem",
        destino: "#pdf-destino",
        pagamento: "#pdf-pagamento",
        valor: "#pdf-valor"
    };

    for (let campo in camposUI) {
        const el = document.querySelector(camposUI[campo]);
        if (!el) continue;

        let valor = data[campo];
        if (campo === "data" && valor) {
            valor = new Date(valor).toLocaleString("pt-BR");
        }

        if (valor) {
            el.parentElement.style.display = "list-item"; // mostra
            el.textContent = valor;
        } else {
            el.parentElement.style.display = "none"; // esconde o <li> inteiro
        }
    }

    
    document.getElementById("comprovante-pdf").style.display = "block";
}

document.getElementById("btn-comprovante").addEventListener("click", () => {
    // 1. Pega os dados do formulário
    const data = getComprovanteData();
    
    // 2. Atualiza a interface (a parte do HTML que vai virar PDF)
    updateComprovanteUI(data);

    // 3. AGUARDA um instante e SÓ DEPOIS gera o PDF
    setTimeout(() => {
        baixarPDF();
    }, 100); // Um atraso de 100 milissegundos é suficiente
});

function baixarPDF() {
    const element = document.getElementById("comprovante-pdf");
    const nome = document.getElementById("nome").value || "passageiro";
    const opt = {
        margin: 10,
        filename: "Comprovante de Corrida  - " + nome + ".pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
}

function enviarEmail() {
    const data = getComprovanteData();
    updateComprovanteUI(data);

    const campos = {
        nome: "Nome do Passageiro",
        cpf: "CPF",
        data: "Data",
        origem: "Origem",
        destino: "Destino",
        pagamento: "Forma de Pagamento",
        valor: "Valor"
    };

    let emailBody = "<ul>";
    for (let key in campos) {
        if (data[key]) {
            let valor = key === "data" ? new Date(data[key]).toLocaleString("pt-BR") : data[key];
            emailBody += `<li><strong>${campos[key]}:</strong> ${valor}</li>`;
        }
    }
    emailBody += "</ul>";

    const emailData = {
        nome: data.nome || "",
        emailBody: emailBody,
        email: data.email || ""
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
    if (!telefone || telefone.length < 10) return alert("Por favor, insira um telefone válido.");
    window.open(`https://wa.me/${telefone}`, "_blank");
}

document.getElementById("btn-comprovante").addEventListener("click", () => {
    const data = getComprovanteData();
    updateComprovanteUI(data);
    baixarPDF();
});

document.getElementById("btn-email").addEventListener("click", enviarEmail);
document.getElementById("btn-conversa").addEventListener("click", entrarNaConversa);
