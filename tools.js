module.exports = {

    escapeHtml: function (str) {
        if ((str === null) || (str === ''))
            return ""
        else
            str = str.toString();
        str = str.replace(/&nbsp;/g, ' ')
        str = str.replace(/<hr>/g, ' ')
        return str.replace(/<[^>]*>/g, '');
    },

    escapeContent: async function (str) {
        if ((str === null) || (str === ''))
            return ""
        else
            str = str.toString();
        str = str.replace(/(\r\n|\n|\r)/gm, " ");
        str = str.replace(/&nbsp;/g, '')
        str = str.replace(/<hr>/g, '')
        str = str.replace(/(\&lt;img.*?\&gt;)/g, '')
        return str
    },
    
    sortFunction: function (a, b) { // sort by date
        var dateA = new Date(a.orderDate).getTime();
        var dateB = new Date(b.orderDate).getTime();
        return dateA > dateB ? 1 : -1;
    },

    between: function (min, max) { // generate random number between 2 numbers
        return Math.floor(
            Math.random() * (max - min) + min
        )
    },

    getImg: function (str) { // get the image from the content
        var imgExists = str.indexOf('<img src="');
        if (imgExists > -1) {
            var i = imgExists + 10;
            str = str.substr(i);
            str = str.substr(0, str.indexOf('"'));
            if (str != "") {
                return str;
            } else {
                return null;
            }
        }
    },
    
    uniqueId: function () {
        return Math.random().toString(36).substr(2, 9);
    }
};