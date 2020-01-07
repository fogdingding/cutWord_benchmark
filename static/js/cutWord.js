var domain = "https://gais.ccu.edu.tw:5005"
// 老師的 https://gais.ccu.edu.tw:5005/
// IK https://gais.ccu.edu.tw:5005/ik
// CKIP https://gais.ccu.edu.tw:5005/ckip
// jieba https://gais.ccu.edu.tw:5005/jieba
// hanlp https://gais.ccu.edu.tw:5005/hanlp
// stanford https://gais.ccu.edu.tw:5005/stanford


$("#search").click(async() => {
    console.log("search");
    let cutWordData = $("form").serializeArray();
    let wordData = null;
    let original = null;
    let goal = null;
    console.log(cutWordData);
    await cutWordData.forEach(async element => {
        if(element.name == "article"){
            wordData = element.value;
            console.log(wordData);
        }
        if(element.name == "original"){
            original = element.value;
        }
        if(element.name == "goal"){
            goal = element.value;
        }
    });
    let original_cutWord = await get_cutWord(original, wordData);
    let goal_cutWord = await get_cutWord(goal, wordData);
    // console.log(original, " original_cutWord", original_cutWord);
    // console.log(goal, " goal_cutWord", goal_cutWord);
    $("#container").children().remove();
    $('.spinner-border').css('display','block');
    let status = await set(original_cutWord, goal_cutWord);
    if (status == true){
        setTimeout(
            function() 
            {
                $('.spinner-border').css('display','none');
            }, 1000
        );
    }
})

function get_cutWord(type,article) {
    let url = null;
    if(type == 'GAIS'){
        url = domain + '/';
    }
    if(type == 'IK'){
        url = domain + '/ik';
    }
    if(type == 'CKIP'){
        url = domain + '/ckip';
    }
    if(type == 'HANLP'){
        url = domain + '/hanlp';
    }
    if(type == 'JIEBA'){
        url = domain + '/jieba';
    }
    if(type == 'STANFORD'){
        url = domain + '/stanford';
    }
    let data = JSON.stringify({text: article});
    let cut_wrod = null;
    $.ajax({
        method: "POST",
        url: url,
        contentType: "application/json",
        data: data,
        dataType: "json",
        async: false,
        success:function(data){
            console.log(type + ":" + data.text);
            cut_wrod = data.text;
        },
        error: function(){
            console.log(type + " ajax error, on get_cutWord");
        },
    })
    return cut_wrod;
}

async function set(originalTxt, modifiedTxt) {
    if(originalTxt == ''){
        originalTxt = "無任何產出";
    } else {
        originalTxt = originalTxt.replace(/(\ )+/g, '\n');
    }
    if(modifiedTxt == ''){
        modifiedTxt = "無任何產出";
    } else {
        modifiedTxt = modifiedTxt.replace(/(\ )+/g, '\n');
    }

    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.18.1/min/vs' }});
    await require(['vs/editor/editor.main'], function () {

        monaco.editor.defineTheme('myTheme', {
            base: 'vs',
            inherit: true,
            rules: [{ background: 'EDF9FA' }],
            colors: {
                'diffEditor.insertedTextBackground': '#9accff', // Background color for text that got inserted.
                'diffEditor.removedTextBackground': '#9accff', // Background color for text that got removed.
                'diffEditor.insertedTextBorder': '#9accff', // Outline color for the text that got inserted.
                'diffEditor.removedTextBorder': '#9accff' // Outline color for text that got removed.
            }
        });
        monaco.editor.setTheme('myTheme');

        let diffEditor = monaco.editor.createDiffEditor(document.getElementById('container'),{
            fontSize: 20,
            language: "text",
            renderLineHighlight: "none"
        });
        diffEditor.setModel({
            original: monaco.editor.createModel(originalTxt, 'text'),
            modified: monaco.editor.createModel(modifiedTxt, 'text'),
        })
    });
    return true;
}