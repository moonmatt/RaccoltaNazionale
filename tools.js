module.exports = {

escapeHtml: function (str) {
  if ((str === null) || (str === ''))
	  return "L'articolo non contiene testo, probabilmente è un video. Va visualizzato sul sito originale";
  else
    str = str.toString();
    str = str.replace(/&nbsp;/g, ' ')
  	return str.replace(/<[^>]*>/g, '');
},

sortFunction: function(a,b){  
    var dateA = new Date(a.date).getTime();
    var dateB = new Date(b.date).getTime();
    return dateA > dateB ? 1 : -1;  
  }

};