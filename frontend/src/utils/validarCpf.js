export function validarCpf(cpf) {
    const numeros = cpf.replace(/\D/g, "")

    if (numeros.length !== 11) {
        return false
    }

    // Rejeita sequências repetidas (111.111.111-11, 222.222.222-22, etc)
    if (/^(\d)\1{10}$/.test(numeros)) {
        return false
    }

    function calcularDigito(base) {
        let soma = 0
        let peso = base.length + 1

        for (const digito of base) {
            soma += Number(digito) * peso
            peso--
        }

        const resto = soma % 11
        return resto < 2 ? 0 : 11 - resto
    }

    const nove = numeros.slice(0, 9)
    const digito1 = calcularDigito(nove)
    const digito2 = calcularDigito(nove + digito1)

    return numeros === nove + String(digito1) + String(digito2)
}