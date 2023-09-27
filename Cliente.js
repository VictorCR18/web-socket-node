const net = require('net');
const readline = require('readline');

// Defina a porta e o endereço IP do servidor
const port = 3000;
const host = '192.168.0.7';

// Função para configurar a interação com o servidor
function iniciarInteracao() {
  // Crie uma instância do cliente de soquete
  const client = new net.Socket();

  // Conecte-se ao servidor
  client.connect(port, host, () => {
    console.log('Conectado ao servidor');

    // Configurar entrada de usuário via linha de comando
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Função para receber comandos do usuário
    function receberComando() {
      rl.question('Digite um comando (por exemplo, CALCULAR IMC 70 175 ou "sair" para encerrar): ', (comando) => {
        if (comando.toLowerCase() === 'sair') {
          // Se o usuário digitar "sair", encerre a conexão com o servidor e o cliente
          client.end();
          rl.close();
        } else {
          // Envie o comando para o servidor
          client.write(comando);
        }
      });
    }

    // Lidar com os dados recebidos do servidor
    client.on('data', (data) => {
      console.log(`Dados recebidos do servidor: ${data}`);
      receberComando(); // Solicite o próximo comando após receber a resposta do servidor
    });

    // Lidar com o evento de fechamento da conexão
    client.on('close', () => {
      console.log('Conexão com o servidor encerrada');
      rl.close();
    });

    // Lidar com erros de conexão
    client.on('error', (err) => {
      console.error('Erro de conexão:', err.message);
      rl.close();
    });

    // Inicie o processo de receber comandos
    receberComando();
  });
}

// Iniciar a interação do cliente
iniciarInteracao();
