const net = require("net");

// Função para calcular o IMC
function calcularIMC(peso, altura) {
  altura = altura / 100; // Converter altura de cm para metros :)
  return (peso / (altura * altura)).toFixed(2);
}

// Determina estado
function determinarCategoriaIMC(imc) {
  if (imc < 18.5) {
    return "Magro";
  } else if (imc >= 18.5 && imc < 24.9) {
    return "Peso Normal";
  } else {
    return "Gordo";
  }
}

// Cria um servidor TCP
const server = net.createServer((socket) => {
  // Este callback será chamado sempre que um cliente se conectar
  console.log("Cliente conectado");
  // Lida com os dados recebidos do cliente
  socket.on("data", (data) => {
    const mensagem = data.toString().trim(); // Converter os dados em uma string e remover espaços em branco

    // Verifica se a mensagem começa com "CALCULAR IMC"
    if (mensagem.startsWith("CALCULAR IMC")) {
      // Divide a mensagem em partes separadas por espaço
      const partes = mensagem.split(" ");

      // Verifica se existem duas partes (CALCULAR IMC <peso> <altura>)
      if (partes.length === 4) {
        const peso = parseFloat(partes[2]);
        const altura = parseFloat(partes[3]);

        if (!isNaN(peso) && !isNaN(altura)) {
          const imc = calcularIMC(peso, altura);
          const categoriaIMC = determinarCategoriaIMC(imc);
          socket.write(`Seu IMC é: ${imc} - Categoria: ${categoriaIMC}`);
        } else {
          socket.write("Por favor, forneça valores válidos de peso e altura.");
        }
      } else {
        socket.write("Formato incorreto. Use: CALCULAR IMC <peso> <altura>");
      }
    } else {
      socket.write(
        "Comando não reconhecido. Use: CALCULAR IMC <peso> <altura>"
      );
    }
  });

  // Lida com o evento de fechamento da conexão
  socket.on("end", () => {
    console.log("Cliente desconectado");
  });

  // Lidar com erros de conexão
  socket.on("error", (err) => {
    console.error("Erro de conexão:", err.message);
  });
});

//Porta e o endereço IP para o servidor
const port = 3000;
const host = "172.25.254.233";

// Inicia o servidor na porta e endereço especificados
server.listen(port, host, () => {
  console.log(`Servidor de soquete está ouvindo em ${host}:${port}`);
});
