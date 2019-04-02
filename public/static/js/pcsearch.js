// author 刘鑫
// date   2018-05.25
var t = $;
var searchApp = new Vue({
	el : "#search",
	data : {
		nowType : 1,
		comNumList : [],
		expressCode : '',
	},
	methods: {
        comNum : function()
        {
        	t('#loading').show();
            var them  = this;
            var ecode = them.expressCode;
            if(ecode.length<5){
            	layer.msg('快递单号不合法',{icon:2});

            	them.hideload();
            	return;
            }
            // var token = t('')
            var sendData = {ecode:ecode};
            t.ajax({type:'POST',url:'/index/express/autoCom',dataType:'json',data:sendData,success:function(rp)
	            {
	                if(rp.auto.length>0) {

	                	them.comNumList = rp.auto;
	                	t('#com_list').show();
	                } else {
                        layer.msg('快递单号未识别',{icon:2});
	                }
	                them.hideload();
	            }
            })

        },
        showDialog : function()
        {
            t("#dialog").animate({top:"85px"},350);
            t("#dialog").animate({top:"75px"},100);
        },
        hideload : function()
        {
            t('#loading').hide();
        },


	}
});
function goon(e){
    var typ = e.target.getAttribute('ep-type');
    var cod = e.target.getAttribute('ep-code');
    var arg = 'search/'+typ+'/'+cod+'/';
    arg += $("input[name='__token__']").eq(0).val();
    window.location.href=arg;
}
if(!getCookie('hasee')) {
    layer.alert('作者唯一微信LX6868886,有外部网站盗用了我的网站源码用来贩卖,十分可耻,如有需要请联系本人微信,价格低于市场价!',{icon:6},function(index){
            setCookie('hasee','whoops','s120');
        layer.close(index);
    });
}
function getsec(str){
    var str1=str.substring(1,str.length)*1; 
    var str2=str.substring(0,1); 
    if (str2=="s"){
       return str1*1000;
    }else if (str2=="h"){
       return str1*60*60*1000;
    }else if (str2=="d"){
       return str1*24*60*60*1000;
    }
}
function setCookie(name,value,time){
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec*1);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getCookie(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)) return unescape(arr[2]);
    return null;
}

// $(document).ready(function(){

//     // $('#dialog').on('click', '.weui-dialog__btn', function(){
//     //     $(this).parents('.js_dialog').fadeOut(200);
//     // });

//     // searchApp.showDialog('注册后免费享用快递查询功能','去注册','/wechat/my')

// })