<?php

namespace app\api\controller;
use think\Db;
use think\Controller;
use think\Request;
use app\api\model\SercertContent;
use app\api\model\SercertContentText;

Class Sercert extends Controller
{
	public function _initialize() {
        if('GET' == request()->method()) {
            echo (json_encode(['msg'=>'非法访问!']));die;
        }
	}

    public function saveSercert(Request $request)
    {
    	$sercert_data = $request->post();
    	return json($this->_save($sercert_data));
    }

    public function getSercertList(Request $request)
    {
        $request_data = $request->post();
        $request_data['s'] = isset($request_data['s']) ? intval($request_data['s']) : 1;
        return json($this->_list($request_data['openid'],$request_data['s']));
    }

    public function getSercert(Request $request)
    {
        $request_data = $request->post();
        return json($this->_detail($request_data['secert_id'],$request_data['openid'],$request_data['option']));
    }

    public function delSercert(Request $request)
    {
        $request_data = $request->post();
        return json($this->_del($request_data['secert_id']));
    }

    /**
    *秘密表保存操作
    */
    private function _save($sercert)
    {

        $reponse = array();
        $uid = $this->_getUid($sercert['openid']);
        if(!$uid) {
            $reponse['msg']  = '该用户未注册或openid未发送!';
            $reponse['code'] = 4;
        } else {
        	$sercert['uid'] = $uid;
        	$contentData   = $this->_sercertContent(trim($sercert['content']));
        	unset($sercert['content']);
                $SercertContentText = new SercertContentText;
                $SercertContentText->data($contentData);
                $SercertContentText->save();
                $contentIn = $SercertContentText->id;
            if(!$contentIn) {
                $reponse['msg']  = '评论内容写入失败!';
                $reponse['code'] = 3;
            } else {
	            $sercert['content_id'] = $contentIn;
	            $sercertData = $this->_sercertData($sercert);
                    $SercertContent = new SercertContent;
                    $SercertContent->data($sercertData);
    	            $sercertIn = $SercertContent->save();
	            if($sercertIn) {
	                $reponse['msg']  = '投放成功!';
	                $reponse['code'] = 1;
	            } else {
	                $reponse['msg']  = '投放失败!';
	                $reponse['code'] = 2;
	            }
            }
        }
        return $reponse;
    }

    /**
    *秘密表数据过滤操作
    */
    private function _sercertData($sercert)
    {
        $sercertData                = array();
        $sercertData['create_time'] = strval(time());
        $sercertData['uid']       = $sercert['uid'];
        $sercertData['or_read']   = 1;
        $sercertData['content_id'] = $sercert['content_id'];
    	return $sercertData;

    }

    /**
    *内容表数据过滤操作
    */
    private function _sercertContent($content)
    {
        $lenType = 2; // 默认类型长度
        $lenLimit = 65; // 长文字长度限制
        $contentData = array();
        $_content = htmlspecialchars(strip_tags(trim($content)));
    	if(strlen($content) <= 250) {
            $lenType = 1;
            $contentData['shortt'] = $_content;
    	} else {
            $contentData['longt'] = $_content;
    	}
    	$contentData['type'] = $lenType;
    	return $contentData;

    }

    private function _list($openid,$s)
    {
        $uid = $this->_getUid($openid);
        if(!$uid) return ['code'=>0,'msg'=>'用户未登录'];
        $page_num = 15;
        $start = ($s-1)*$page_num;
        $count = DB::name('app_sercert')->where('uid',$uid)->count();
        if($start>$count) return ['code'=>3,'msg'=>'我是有底线的'];
        $_list = Db::query("SELECT s.*,c.shortt,c.longt,c.type FROM xer_app_sercert AS s,xer_app_content AS c WHERE s.content_id=c.id AND s.uid=? ORDER BY s.id DESC LIMIT ?,?",[$uid,$start,$page_num]);
        $response = [];
        if($_list) {
            foreach ($_list as $k => $i) {
                if($i['type']==1) {
                    $_list[$k]['subtitle'] = mb_substr($i['shortt'],0,6,'utf8').'...';
                } else if ($i['type']==2) {
                    $_list[$k]['subtitle'] = mb_substr($i['longt'],0,6,'utf8').'...';
                }
                unset($_list[$k]['shortt']);
                unset($_list[$k]['longt']);
            }
            $response['data'] = $_list;
            $response['code'] = 1;
            $response['msg']  = '获取成功';
        } else {
            $response['code'] = 2;
            $response['msg']  = '客官你还没有写你的小秘密呢!';
        }
        return $response;

    }
    
    private function _detail($sercert_id,$openid,$option)
    {
        $uid = $this->_getUid($openid);
        if(!$uid) return ['code'=>0,'msg'=>'用户未登录'];
    	if($option=='secert') {
            $_item = Db::query("SELECT s.*,c.shortt,c.longt,c.type FROM xer_app_sercert AS s,xer_app_content AS c WHERE s.content_id=c.id AND s.uid=? AND s.id=? LIMIT 1",[$uid,$sercert_id]);
        } else if ($option='other') {
            $_item = Db::query("SELECT s.*,c.shortt,c.longt,c.type,u.avatarUrl,u.nickname,u.id FROM xer_app_sercert AS s,xer_app_content AS c,xer_app_user AS u WHERE s.content_id=c.id AND s.uid=u.id AND s.or_read=? AND s.id=? LIMIT 1",[2,$sercert_id]);
        } else {
            return ['code'=>2,'msg'=>'您走错了门!'];
        }
        $response = [];
        if($_item) {
            $_item = $_item[0];
            $_item['create_time'] = date('Y-m-d H:i:s',$_item['create_time']);
            if($_item['type']==1) {
                $_item['content'] = $_item['shortt'];
            } else if ($_item['type']==2) {
                $_item['content'] = $_item['longt'];
            }
            unset($_item['shortt']);
            unset($_item['longt']);
            $response['data'] = $_item;
            $response['code'] = 1;
            $response['msg']  = '获取成功';
        } else {
            $response['code'] = 2;
            $response['msg']  = '这封信好像被丢弃了!!';
        }
        return $response;

    }

    private function _del($sercert_id)
    {
        return Db::name('app_sercert')->delete($sercert_id);
    }

    private function _getUid($openid)
    {
        $uidInfo = Db::name('app_user')->field('id')->where('openid',$openid)->find();
        return $uidInfo['id'];
    }

}