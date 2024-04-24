const axios = require('axios');
const cheerio = require('cheerio');

async function getListManga() {
	const url = `https://komikcast.lol/`;
	const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const res = [];
  $('div.postbody>div.bixbox').each((i, elem) => {
    const cond = $(elem).find('div.releases>h3>span').text();
    if (cond && cond === 'Rilisan Terbaru') {
      $(elem).find('div.bixbox>div.listupd>div.utao').each((i, element) => {
        const img = $(element).find('div.uta>div.imgu>a>img').attr('src');
        const url = $(element).find('div.uta>div.luf>a').attr('href');
        const title = $(element).find('div.uta>div.luf>a').attr('title');

        res.push({ img, url, title });
      })
    }
	});

	return res;
}

async function getDetailManga(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  let title1 = '';
  let title2 = '';
  const etc = [];
  const tags = [];

  const img = $('div.komik_info-cover-image').find('img').attr('src');
  $('div.komik_info-content-body').each((i, elem) => {
    title1 = $(elem).find('h1').text();
    title2 = $(elem).find('span.komik_info-content-native').text();

    $(elem).find('div.komik_info-content-meta>span').each((i, element) => {
      let eachEtc = $(element).text();
      eachEtc = eachEtc.replaceAll('\n', '').trim();
      etc.push(eachEtc);
    });
  
    $(elem).find('span.komik_info-content-genre>a').each((i, element) => {
      const eachTag = $(element).text();
      tags.push(eachTag);
    });
  });

  const rate = $('div.komik_info-content-rating').find('div.komik_info-content-rating-bungkus>div.data-rating>strong').text();

  let sinopsis = $('div.komik_info-description').find('div>p').text();
  sinopsis = sinopsis.replaceAll('\n', '').replaceAll('\t', '');

  const listCp = []

  $('div.komik_info-body>div.komik_info-chapters>ul>li').each((i, element) => {
    const url = $(element).find('a.chapter-link-item').attr('href');
    let chapter = $(element).find('a.chapter-link-item').text();
    chapter = chapter.replaceAll('\n', '').trim();
    let date = $(element).find('div.chapter-link-time').text();
    date = date.replaceAll('\n', '').trim();
    listCp.push({ url, chapter, date });
  });

  return { img, title1, title2, etc, tags, rate, sinopsis, listCp };
}

async function getDetailChapter(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const title = $('div.chapter_headpost').find('h1').text();

  const list = [];

  $('div.main-reading-area>img').each((i, element) => {
    const url = $(element).attr('src');
    list.push(url);
  });

  let prev = '';
  let next = '';

  $('div.right-control>div.nextprev>a').each((i, element) => {
    if ($(element).attr('rel') === 'prev') prev = $(element).attr('href');
    else next = $(element).attr('href');
  })

  return { title, list, prev, next };
}

async function searchManga(name) {
	const url = `https://komikcast.lol/?s=${name}`;
	const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const res = [];
  $('div.search-item>div.list-update_item').each((i, elem) => {
    const url = $(elem).find('a').attr('href');
    const img = $(elem).find('div.list-update_item-image>img').attr('src');
    const title = $(elem).find('div.list-update_item-info>h3').text();

    res.push({ url, img, title });
	});

	return res;
}

module.exports = {
  getListManga,
  getDetailManga,
  getDetailChapter,
  searchManga
}