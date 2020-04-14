module.exports = {
    escapeHtml: function (str) {
        if ((str===null) || (str===''))
		return false;
	else
		str = str.toString();
  		return str.replace(/<[^>]*>/g, '');
    }
  };