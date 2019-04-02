{
  "code": 0
  ,"msg": ""
  ,"data": [{
    "title": "用户"
    ,"icon": "layui-icon-user"
    ,"list": [{
      "title": "小程序用户"
      ,"jump": "secret/appuser"
    }, {
      "name": "homepage1"
      ,"title": "后台用户"
      ,"jump": "secret/secretuser"
    }]
  },{
    "name" : "secretapp"
    ,"title": "秘密"
    ,"icon": "layui-icon-diamond"
    ,"list": [{
      "name": "secretlist"
      ,"title": "列表"
      ,"jump": "secretapp/list"
    }, {
      "name":"secrets"
      ,"title": "关系"
      ,"jump": "secretapp/ship"
    }]
  },{
    "name" : "config"
    ,"title": "设置"
    ,"icon": "layui-icon-set"
    ,"list": [{
      "name": "secretlist"
      ,"title": "小程序设置"
      ,"jump": "config/app"
    }, {
      "name":"configs"
      ,"title": "后台设置"
      ,"jump": "secret/web"
    }]
  }]
}