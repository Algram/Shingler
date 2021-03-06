var gData = [];

$(document).ready(function() {
    $("#compare").click(function() {
        var text1 = $('#text1').val();
        var text2 = $('#text2').val();

        text1 = cleanString(text1);
        text2 = cleanString(text2);

        var arr1 = text1.split(' ');
        var arr2 = text2.split(' ');

        shingleTest(arr1, arr2);
    });

    /*$("#entry").change(function() {
        if (!/^http:\/\//.test(this.value)) {
            this.value = "http://" + this.value;
        }
    });*/

    $('#export').click(function () {
        exportToCSV();
    });
});

function shingleTest(a1, a2) {
    var a1new = [];
    var a2new = [];
    var aMerged = [];
    var intersection = 0;
    var union = 0;

    for(var i = 0; i < a1.length-1; i++) {
        a1new.push(a1[i]+' '+a1[i+1]);
    }

    for(var j = 0; j < a2.length-1; j++) {
        a2new.push(a2[j]+' '+a2[j+1]);
    }

    a1new = cleanDupes(a1new);
    a2new = cleanDupes(a2new);

    //GET INTERSECTION
    var longest = 0;
    if(a1new.length >= a2new.length) {
        longest = a1new.length;
    }else {
        longest = a2new.length;
    }

    for(var k = 0; k < longest; k++) {
        var num = jQuery.inArray(a1new[k], a2new);
        if(num > -1) {
        //in array
            intersection += 1;
        }
    }

    //GET UNION
    aMerged = getUnion(a1new.concat(a2new));
    union = aMerged.length;

    var matches = intersection + "/" + union;
    var score = ((intersection/union)*100).toFixed(2);
    score = score.toString();
    updateBadges(matches, score);
}

function getUnion(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

function cleanDupes(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

function cleanString(str) {
    str = str.replace(/([^ǔa-z\u00C0-\u017E]([ǔa-z\u00C0-\u017E]{1,3})(?=[^ǔa-z\u00C0-\u017E]|$))/g,'');
    str = $.trim(str);
    str = str.replace(/\s+/g, ' ');
    str = str.replace(/\n/, ' ');
    str = str.replace(/\./g,' ');
    str = str.replace(/\?/g,' ');
    str = str.replace(/\!/g,' ');
    str = str.replace(/\,/g,' ');
    str = str.replace(/\-/g,' ');
    str = str.replace(/\:/g,' ');
    str = str.replace(/\–/g,' ');
    str = str.replace(/\„/g,' ');
    str = str.replace(/\“/g,' ');
    str = str.toLowerCase();
    str = str.replace(/([^ǔa-z\u00C0-\u017E]([ǔa-z\u00C0-\u017E]{1,3})(?=[^ǔa-z\u00C0-\u017E]|$))/g,'');
    str = str.replace(/\s+/g, ' ');
    str = $.trim(str);

    return str;
}

function updateBadges(str1, str2) {
    $("#matches").text(str1);
    $("#score").text(str2);

    gData.push([str1, str2]);
}

function exportToCSV() {
    var rowDelim = "%0A";
    var csvHead = 'Matching Shingles,Shingle Score';
    var csvStr = csvHead + rowDelim;

    for(var i = 0; i < gData.length; i++) {
        var opt = gData[i][0];
        var res = gData[i][1];

        csvStr += opt;
        csvStr += ",";
        csvStr += res;
        csvStr += rowDelim;
    }

    var a         = document.createElement('a');
    a.href        = 'data:text/csv;charset=utf-8,' + csvStr;
    a.target      = '_blank';
    a.download    = 'export' + getDate() + '.csv';

    document.body.appendChild(a);
    a.click();
}

function getDate() {
  var today = new Date();
  var d = today.getDate();
  var m = today.getMonth()+1; //January is 0!
  var y = today.getFullYear();
  var h = today.getHours();
  var min = today.getMinutes();
  var s = today.getSeconds();

  if(d<10) {
    d='0'+d;
  }

  if(m<10) {
    m='0'+m;
  }

  if(h<10) {
    h='0'+h;
  }

  if(min<10) {
    min='0'+min;
  }

  if(s<10) {
    s='0'+s;
  }

  today = d+'_'+m+'_'+y+'_'+h+'_'+min+'_'+s;
  return today;
}
