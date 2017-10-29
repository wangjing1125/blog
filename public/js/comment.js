/**
 * Created by 35488 on 2017/7/7.
 */
var page=1;
var pages=1;
var prepage=5;
var comment=[];

$("#messageBtn").on('click',function () {
    $.ajax({
        type:'post',
        url:'/api/comment/post',
        data:{
            contentid:$("#contentId").val(),
            content:$("#messageContent").val()
        },
       success:function (responseData) {
           $("#messageContent").val('');
           //console.log(responseData);
           comment=responseData.data.comments.reverse();
           renderComment();
           //console.log(responseData.data);
       }

    });
});

$.ajax({
    type:'get',
    url:'/api/comment',
    data:{
        contentid:$("#contentId").val(),
    },
    success:function (responseData) {
       comment=responseData.data.reverse();
        renderComment();
    }
})

$('.pager').delegate('a','click',function () {
   if($(this).parent().hasClass('previous')){
       page--;
    }else {
       page++;
   }
   renderComment();
})



function  renderComment() {
    $('#messageCount').html(comment.length);

    pages=Math.max(Math.ceil(comment.length/prepage),1);
    var $li=$('.pager li');
    $li.eq(1).html(page+'/'+pages);
    var start=Math.max(0,(page-1)*prepage);
    var end=Math.min(start+prepage,comment.length);

    if(page<=1){
        page=1;
        $li.eq(0).html('<span>没有上一页了</span>');
    }else{
        $li.eq(0).html('<a href="javascript:;">上一页</a>');
    }

    if(page>=pages){
        page=pages;
        $li.eq(2).html('<span>没有下一页了</span>');
    }else {
        $li.eq(2).html('<a href="javascript:;">下一页</a>');
    }

    if(comment.length==0){
         $('.messageList').html('<div class="messageBox"><p>还没有留言</p></div>');
    }else{
        var html='';
        for (var i=start;i<end;i++){
            html+= ' <div class="messageBox">'+
                '<p class="name clear"><span class="fl">'+comment[i].username+'</span><span class="fr">'+forment(comment[i].postTime)+'</span></p><p>'+comment[i].content+'</p>'+
                '</div>';

        };
        $('.messageList').html(html);
    }


}

function forment(d) {
    var date1=new Date(d);
    return date1.getFullYear()+'年'+(date1.getMonth()+1)+'月'+date1.getDate()+'日  '+date1.getHours()+':'+date1.getMinutes()+':'+date1.getSeconds();
}