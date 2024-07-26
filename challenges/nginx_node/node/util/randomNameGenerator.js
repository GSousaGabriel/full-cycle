const randomNameGenerator = () => {
    const firstName = ['Ana', 'João', 'Maria', 'Pedro', 'Carlos', 'Laura', 'Rafael', 'Juliana', 'Lucas', 'Camila', 'Roberto', 'Fernanda', 'André', 'Paula', 'Marcelo', 'Adriana', 'Gabriel', 'Thaís', 'Felipe', 'Amanda'];
    const secondName = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Rodrigues', 'Costa', 'Almeida', 'Martins', 'Gonçalves', 'Lima', 'Moreira', 'Santos', 'Pereira', 'Rodrigues', 'Costa', 'Almeida', 'Martins', 'Gonçalves', 'Lima'];
    const firstRandomNameIndex = Math.floor((Math.random() * firstName.length))
    const secondRandomNameIndex = Math.floor((Math.random() * secondName.length))
    const name = `${firstName[firstRandomNameIndex]} ${secondName[secondRandomNameIndex]}`
    
    return name
}

module.exports = { randomNameGenerator };