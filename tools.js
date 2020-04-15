module.exports = {

escapeHtml: function (str) {
    if ((str === null) || (str === ''))
	return "L'articolo non contiene testo, probabilmente è un video. Va visualizzato sul sito originale";
else
    str = str.toString();
    str = str.replace(/&nbsp;/g, ' ')
  	return str.replace(/<[^>]*>/g, '');
}

};