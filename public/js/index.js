/**
 * Created by 35488 on 2017/6/11.
 */
$(function () {
    $loginBox=$("#loginBox");
    $registerBox=$("#registerBox");
    $userInfo=$("#userInfo");
    $logout=$("#logout");

    //切换到登陆页面
    $registerBox.find("a.colMint").on("click",function () {
        $loginBox.show();
        $registerBox.hide();
    });

    //切换到注册页面
    $loginBox.find("a.colMint").on("click",function () {
        $registerBox.show();
        $loginBox.hide();
    });

    //注册
    $registerBox.find("button").on("click",function () {
        $.ajax({
            type:'post',
            url:"/api/user/register",
            data:{
                username:$registerBox.find("[name='username']").val(),
                password:$registerBox.find("[name='password']").val(),
                repassword:$registerBox.find("[name='repassword']").val()
            },
            dataType:'json',
            success:function (result) {
                $registerBox.find(".colWarning").html(result.message);

                if(!result.code){
                    setTimeout(function () {
                        $loginBox.show();
                        $registerBox.hide();
                    },1000)
                }
            }
        })
    })

    //登陆
    $loginBox.find("button").on("click",function () {
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$loginBox.find("[name='username']").val(),
                password:$loginBox.find("[name='password']").val(),
            },
            dataType:'json',
            success:function (result) {
                $loginBox.find(".colWarning").html(result.message);
                if (!result.code) {
                    //登录成功

                   window.location.reload();
                }
            }
        })
    });

    //退出
     $logout.on("click",function () {
         $.ajax({
             url:'/api/user/logout',
             success:function (result) {
                 if(!result.code){
                     //退出成功
                     window.location.reload();
                 }
             }
         })
     })
})