const net = require('net');

// Função para calcular o IMC
function calcularIMC(peso, altura) {
  altura = altura / 100; // Converter altura de cm para metros :)
  return (peso / (altura * altura)).toFixed(2);
}

// Crie um servidor TCP
const server = net.createServer((socket) => {
  // Este callback será chamado sempre que um cliente se conectar

  // Lida com os dados recebidos do cliente
  socket.on('data', (data) => {
    const mensagem = data.toString().trim(); // Converter os dados em uma string e remover espaços em branco

    // Verifica se a mensagem começa com "CALCULAR IMC"
    if (mensagem.startsWith('CALCULAR IMC')) {
      // Divide a mensagem em partes separadas por espaço
      const partes = mensagem.split(' ');

      // Verifica se existem duas partes (CALCULAR IMC <peso> <altura>)
      if (partes.length === 4) {
        const peso = parseFloat(partes[2]);
        const altura = parseFloat(partes[3]);

        if (!isNaN(peso) && !isNaN(altura)) {
          const imc = calcularIMC(peso, altura);
          socket.write(`Seu IMC é: ${imc}`);
        } else {
          socket.write('Por favor, forneça valores válidos de peso e altura.');
        }
      } else {
        socket.write('Formato incorreto. Use: CALCULAR IMC <peso> <altura>');
      }
    } else {
      socket.write('Comando não reconhecido. Use: CALCULAR IMC <peso> <altura>');
    }
  });

  // Lida com o evento de fechamento da conexão
  socket.on('end', () => {
    console.log('Cliente desconectado');
  });

  // Lidar com erros de conexão
  socket.on('error', (err) => {
    console.error('Erro de conexão:', err.message);
  });
});

//Porta e o endereço IP para o servidor
const port = 3000;
const host = '192.168.0.7';

// Inicie o servidor na porta e endereço especificados
server.listen(port, host, () => {
  console.log(`Servidor de soquete está ouvindo em ${host}:${port}`);
});
