const axios = require('axios');

module.exports = async (req, res) => {
  const { page = 1, filter = '' } = req.query;
  const url = `https://www.kabum.com.br/hardware/processadores/amd/json?page_number=${page}&page_size=20&facet_filters=&sort=most_searched`;

  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    // data.products pode ser o array de produtos
    const produtos = (data.products || [])
      .filter(prod => 
        prod.name.toLowerCase().includes('amd') && 
        prod.name.toLowerCase().includes(filter.toLowerCase())
      )
      .map(prod => ({
        nome: prod.name,
        preco: prod.price,
        link: `https://www.kabum.com.br/produto/${prod.id}`
      }));

    res.status(200).json(produtos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
};