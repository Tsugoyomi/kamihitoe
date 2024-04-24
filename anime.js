const axios = require('axios');
const cheerio = require('cheerio');

async function getList() {
	const url = `https://animekompi.cam/`;
	const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const res = [];
  $('div.bsx').each((i, elem) => {
    const img = $(elem).find('img').attr('data-lazy-src');
    const url = $(elem).find('a').attr('href');
    const subTitle = $(elem).find('div.tt>h2').text();
    $(elem).find('div.tt>h2').remove();
    const title = $(elem).find('div.tt').text();
    res.push({ img, url, title, subTitle, type: 'L' });
	});

	return res;
}

async function getDetail(url, type) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  if (type === 'eps') {
    let embedUrl = ''
    $('#embed_holder').each((i, elem) => {
      embedUrl = $(elem).find('IFRAME').attr('data-lazy-src');
    })
  
    const title = $('div.title-section>h1').text();
    let desc = $('div.mindes').text();
    desc = desc.replaceAll('\n', '').replaceAll('\t', '');
    const tags = [];
    $('div.genxed>a').each((i, elem) => {
      const eachTag = $(elem).text();
      tags.push(eachTag);
    })
  
    return { embedUrl, title, desc, tags };
  } else {
    const img = $('div.bigcontent').find('img').attr('data-lazy-src');
    const title = $('div.bigcontent').find('h1.entry-title').text();
    let rate = $('div.bigcontent').find('div.rating').text();
    rate = rate.replaceAll('\n', '').replaceAll('\t', '');

    const etc = []
    $('div.bigcontent').find('div.spe>span').each((i, element) => {
      const eachEtc = $(element).text();
      etc.push(eachEtc);
    })

    const tags = [];
    $('div.bigcontent').find('div.genxed>a').each((i, element) => {
      const eachTag = $(element).text();
      tags.push(eachTag);
    });

    let sinopsis = $('div.entry-content').text();
    sinopsis = sinopsis.replaceAll('\n', '').replaceAll('\t', '');

    const listEps = []
    $('div.eplister>ul>li').each((i, element) => {
      const url = $(element).find('a').attr('href');
      const eps = $(element).find('div.epl-num').text();
      const epsTitle = $(element).find('div.epl-title').text();
      const date = $(element).find('div.epl-date').text();
      listEps.push({ url, eps, epsTitle, date });
    })

    return { img, title, rate, etc, tags, sinopsis, listEps };
  }
}

async function searchAnimeQuery(name) {
  const params = new URLSearchParams();
  params.append('action', 'ts_ac_do_search');
  params.append('ts_ac_query', name);

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const { data } = await axios.post('https://animekompi.cam/wp-admin/admin-ajax.php', params, config);

  return data;
}

async function searchAnime(name) {
	const url = `https://animekompi.cam/?s=${name}`;
	const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const res = [];
  $('div.bsx').each((i, elem) => {
    const img = $(elem).find('img').attr('src');
    const url = $(elem).find('a').attr('href');
    const subTitle = $(elem).find('div.tt>h2').text();
    $(elem).find('div.tt>h2').remove();
    const title = $(elem).find('div.tt').text();
    res.push({ img, url, title, subTitle, type: 'S' });
	});

	return res;
}

module.exports = {
  getList,
  getDetail,
  searchAnimeQuery,
  searchAnime
};