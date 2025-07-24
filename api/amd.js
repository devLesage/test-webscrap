const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const { page = 1, filter = '' } = req.query;
  const url = `https://www.kabum.com.br/hardware/processadores/amd?page_number=${page}&page_size=20&facet_filters=&sort=most_searched`;

  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(data);
    const produtos = [];
    $('.productCard').each((i, el) => {
      const nome = $(el).find('.nameCard').text().trim();
      const preco = $(el).find('.priceCard').text().trim();
      const link = 'https://www.kabum.com.br' + $(el).find('a').attr('href');
      if (nome.toLowerCase().includes('amd') && nome.toLowerCase().includes(filter.toLowerCase())) {
        produtos.push({ nome, preco, link });
      }
    });
    res.status(200).json(produtos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
};