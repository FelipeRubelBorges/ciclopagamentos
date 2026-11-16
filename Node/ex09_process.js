process.stdout.write("Esta gostando do curso? ");
process.stdin.once('data', function(data) {
  process.stdout.write(`Sua resposta foi ${data.toString().trim()}\nObrigado!\n`);
  process.stdin.pause();
});
