(function () {

    var urls =
        ['https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'
        ];

    var i = 0;

    var recursiveCallback = function(){

        if(i++ < urls.length && urls[i]!=undefined) {

            loadScript(urls[i], recursiveCallback)
        } else {

            initProject();
        }
    }

    loadScript(urls[0], recursiveCallback);

    function loadScript(url, callback){

        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            script.onload = function(){
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }




})();

function fillListData(data){
    $('#discuss-plugin').html("");
    for(var i=0;i<data.length;i++){
        //var li = '<div class="discuss"><p id="message">'+data[i].message+'</p><p id="timestamp">'+new Date(data[i].timestamp)+'</p></div>'
        var li = '<p>'+data[i].message+'<span>'+new Date(data[i].timestamp).toTimeString()+'</span></p>'

        $("#discuss-plugin").append(li);
        $('#discuss-container').scrollTop($('#discuss-container').scrollTop()+500);
    }
    
}
function writeDiv() {
    $("#discuss-main").html();
    var template = "<h2>Discuss Plugin</h2>\n" +
        "<div id=\"discuss-container\">\n" +
        "    <div id=\"discuss-plugin\">\n" +
        "    </div>\n" +
        "</div>\n" +
        "<div id=\"bottomArea\">\n" +
        "    <textarea id=\"user-message\"></textarea>\n" +
        "    <div class=\"we\">\n" +
        "        <button id=\"saveComment\">Comment</button>\n" +
        "    </div>\n" +
        "</div>"
    $("#discuss-main").append(template);
}
function getPluginComments(){
    var url = "http://localhost:3001/plugin/comments?apiKey={apiKey}";
    $.ajax({
        type: "GET",
        url: url,
        success: function(data){
            fillListData(data.response);
        },
        dataType: "json"
    });

}

function initProject(){
    setInterval(function () {
        getPluginComments();
    },5000);
    writeDiv();
    getPluginComments();
    writeCss();
    $("#saveComment").on( "click", function() {
        if($("#user-message").val()==="")return;
        var url = "http://localhost:3001/plugin/savecomments?apiKey={apiKey}";
        $.ajax({
            type: "POST",
            url: url,
            data: {message:$("#user-message").val()},
            success: function(data){
                if(data.response==1){
                    getPluginComments();
                }
            },
            dataType: "json"
        });

        $("#user-message").val("");
    });
}

function writeCss() {
    $('#discuss-main').append("<style>a,p{font-family:tahoma}#saveComment,p{position:relative}p:before,p>button{background:#2ecc71}p:after,p:before{content:\"\";display:block;position:absolute}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#888}::-webkit-scrollbar-thumb:hover{background:#555}#discuss-main h2{color:#95b4fa;text-align:center}#discuss-main{background:#2c3e50;width:fit-content}#bottomArea{display:inline}#user-message{width:444px;height:50px;resize:none}#saveComment{width:100px;height:50px}#discuss-container{padding:10px 10px 10px 40px;width:400px;height:400px;overflow:scroll;overflow-x:hidden}a{color:#2ecc71}#discuss-plugin{padding:0 10px 0 50px;border-left:2px solid #34495e}p{padding:15px;background:#34495e;color:#ecf0f1;line-height:1.5}p>span{display:block;padding:5px 5px 10px;color:#7f8c8d;font-style:italic;font-size:13px}p>button{color:#fff;width:100px;padding:10px;border-radius:2px;border:0;font-weight:700;cursor:pointer}p:before{width:20px;height:20px;border-radius:50%;top:-9px;left:-61px}p:after{width:0;height:0;border-style:solid;border-color:#34495e #34495e transparent transparent;border-width:15px;top:0;left:-29px}<style>")
}