// Inicializa EmailJS
emailjs.init("VWEv3xUnqizxBrP-F");

// Função para pegar os dados do formulário
function getComprovanteData() {
    const campos = ["nome", "cpf", "email", "telefone", "data", "origem", "destino", "pagamento", "valor"];
    const data = {};
    campos.forEach(campo => {
        data[campo] = document.querySelector(`#${campo}`)?.value || "";
    });
    return data;
}

// Atualiza o HTML do comprovante
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
            el.parentElement.style.display = "list-item"; // mostra <li>
            el.textContent = valor;
        } else {
            el.parentElement.style.display = "none"; // esconde <li> se vazio
        }
    }

    document.getElementById("comprovante-pdf").style.display = "block"; // mostra div
}

// Função para gerar e baixar o PDF
function baixarPDF() {
    const element = document.getElementById("comprovante-pdf");
    const nome = document.getElementById("nome").value || "passageiro";
    const opt = {
        margin: 10,
        filename: "Comprovante de Corrida - " + nome + ".pdf",
        html2canvas: { scale: 1.5, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
}

// Função para enviar o comprovante por email
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

// Função para abrir conversa no WhatsApp
function entrarNaConversa() {
    const telefone = document.querySelector("#telefone").value.replace(/\D/g, "");
    if (!telefone || telefone.length < 10) return alert("Por favor, insira um telefone válido.");
    window.open(`https://wa.me/${telefone}`, "_blank");
}

// EVENTOS

// Botão para gerar PDF
document.getElementById("btn-comprovante").addEventListener("click", () => {
    const data = getComprovanteData();
    updateComprovanteUI(data);

    // Espera o DOM atualizar antes de gerar PDF
    requestAnimationFrame(() => {
        baixarPDF();
    });
});

// Botão para enviar por email
document.getElementById("btn-email").addEventListener("click", enviarEmail);

// Botão para WhatsApp
document.getElementById("btn-conversa").addEventListener("click", entrarNaConversa);


//Gerar QR Code para pagamento via Pix
  function emv(id, value) {
      const len = String(value.length).padStart(2, '0');
      return id + len + value;
    }

    function crc16(str) {
      let crc = 0xFFFF;
      for (let c of str) {
        crc ^= c.charCodeAt(0) << 8;
        for (let i = 0; i < 8; i++) {
          if ((crc & 0x8000) !== 0) {
            crc = (crc << 1) ^ 0x1021;
          } else {
            crc = crc << 1;
          }
          crc &= 0xFFFF;
        }
      }
      return crc.toString(16).toUpperCase().padStart(4, '0');
    }

    function gerarPayloadPix(valor) {
      const chavePix = "08573589876"; 
      const nome = "RONALDO CEOLA";  // ✅ <= até 25 chars
      const cidade = "SAO PAULO";        // ✅ <= até 15 chars

      const gui = emv("00", "BR.GOV.BCB.PIX");
      const key = emv("01", chavePix);
      const mai = emv("26", gui + key);

      const p00 = emv("00", "01");
      const p52 = emv("52", "0000");
      const p53 = emv("53", "986"); 
      const p54 = valor ? emv("54", parseFloat(valor).toFixed(2)) : "";
      const p58 = emv("58", "BR");
      const p59 = emv("59", nome.substring(0,25));
      const p60 = emv("60", cidade.substring(0,15));
      const p62 = emv("62", emv("05", "*"));

      const semCRC = p00 + mai + p52 + p53 + p54 + p58 + p59 + p60 + p62 + "6304";
      const crc = crc16(semCRC);
      return semCRC + crc;
    }

    document.getElementById('btn-pagamento').addEventListener('click', () => {
      const valor = document.getElementById('valor').value;
      const payload = gerarPayloadPix(valor);

      const qrcodeDiv = document.getElementById('qrcode');
      qrcodeDiv.innerHTML = "";
      new QRCode(qrcodeDiv, {
        text: payload,
        width: 220,
        height: 220
      });

      console.log("Payload PIX:", payload);
    });
    document.getElementById('btn-pagamento').addEventListener('click', () => {
    let valorInput = document.getElementById('valor').value;
    // Remove "R$", espaços e troca vírgula por ponto
    valorInput = valorInput.replace(/[^\d,.-]/g, '').replace(',', '.');

    const payload = gerarPayloadPix(valorInput);

    // Abre uma nova janela
    const win = window.open('', '_blank', 'width=300,height=350');

    // Escreve o HTML da nova janela
    win.document.write(`
        <html>
        <head>
            <title>QR Code PIX</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
        </head>
        <body>
            <h2 style="text-align:center;">Pagamento PIX</h2>
            <div id="qrcode" style="margin:20px auto; width:220px; height:220px;"></div>
            <p style="text-align:center;">Valor: R$ ${valorInput}</p>
            <script>
                new QRCode(document.getElementById('qrcode'), {
                    text: "${payload}",
                    width: 220,
                    height: 220
                });
            </script>
        </body>
        </html>
    `);

    console.log("Payload PIX:", payload);
});
