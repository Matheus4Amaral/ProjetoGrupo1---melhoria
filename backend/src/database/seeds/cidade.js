exports.seed = async function (knex) {
  const existeCidade = await knex('cidade').first('ibge');
  if (existeCidade) {
    console.log("Seed de cidades pulada (já existem registros no banco).");
    return;
  }

  const response = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
  );

  const data = await response.json();

  const cidades = data
    .map((cidade) => {
      const uf =
        cidade.microrregiao?.mesorregiao?.UF?.sigla ||
        cidade.regiao_imediata?.regiao_intermediaria?.UF?.sigla;

      if (!uf) {
        return null;
      }

      return {
        ibge: String(cidade.id),
        uf,
        nome: cidade.nome,
      };
    })
    .filter(Boolean);

  await knex("cidade")
    .insert(cidades)
    .onConflict("ibge")
    .merge(["nome", "uf"]);
};