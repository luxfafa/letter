<?php

namespace app\api\controller;
use think\Db;
use think\Controller;
use think\Request;
use app\api\model\SercertContent;
use app\api\model\Restrict;

Class Salvage extends Controller
{
	public function _initialize() {
        if('GET' == request()->method()) {
            echo (json_encode(['msg'=>'非法访问!']));die;
        }
	}

    public function getSalvage(Request $request)
    {
    	$rq_data = $request->post();
    	return json($this->_getSalvage($rq_data));
    }

    private function _getSalvage($rq_data)
    {
    	$openid   = $rq_data['openid'];
        $uid      = $this->_getUid($openid);
        $response = [];
        $_item = Db::query("SELECT * FROM xer_app_sercert WHERE `uid`<>? AND or_read=? ORDER BY `create_time` ASC LIMIT ?",[$uid,1,18]);
        if(!$_item) {
        	$response = ['code'=>2,'msg'=>'暂时没有合适的信件可打捞'];
        } else {
        	$items_len = count($_item)-1;
        	$item_index = random_int(0,$items_len);
        	$item = $_item[$item_index];
        	if(!$item) {
                $response = ['code'=>2,'msg'=>'错误码40001'];
        	} else {
        		$SercertContent = new SercertContent;
        		$change_info = $SercertContent->save(['or_read'=>2,'passive_uid'=>$uid],['id' => $item['id']]);
        		if(!$change_info) {
                    $response = ['code'=>2,'msg'=>'错误码40002'];
        		} else {
                    $Restrict = new Restrict;
                    $Restrict->data([
					    'uid'         =>  $uid,
					    'passive_uid' =>  $item['uid'],
					    'about_time'  =>  time(),
					    'about_date'  =>  date('Y-m-d H:i:s'),
                        'secert_id'   =>  $item['id']
					]);
					$restrict_info = $Restrict->save();
					if(!$restrict_info) {
						$response = ['code'=>2,'data'=>$item,'msg'=>'错误码40003'];
					}
        		}
        		$response = ['code'=>1,'data'=>$item,'msg'=>'打捞成功'];
        	}
        }
        return $response;
    }

    public function mySalvage(Request $request)
    {
    	$rq_data = $request->post();
        $openid   = $rq_data['openid'];
        $uid      = $this->_getUid($openid);
        $response = [];

        $_list = Db::query("SELECT s.*,from_unixtime(s.create_time) as f_time,u.nickname,u.avatarUrl,r.about_time,r.secert_id
         FROM xer_app_sercert AS s,xer_app_user AS u,xer_app_restrict AS r
         WHERE s.uid<>? AND s.passive_uid=? AND s.or_read=? AND s.uid=u.id AND r.secert_id=s.id
         LIMIT ?,?"
         ,[$uid,$uid,2,0,18]);

        if($_list) {
            foreach ($_list as $k => $z) {
                $_list[$k]['f_time'] = explode(' ',$z['f_time'])[0];
                $_list[$k]['format_time'] = $this->format_date($z['about_time']);
                if(strlen($z['nickname'])>12) {
                    $allcn = preg_match("/^[\x{4e00}-\x{9fa5}]+$/u",$z['nickname']);
                    if(!$allcn) {
                        $_list[$k]['nickname'] = mb_substr($z['nickname'],0,9,'utf8').'...';
                    }
                }
            }
            $response = ['code'=>1,'msg'=>'获取成功','data'=>$_list];
        } else {
            $response = ['code'=>2,'msg'=>'还未打捞信件!'];
        }
        return json($response);
    }

    private function _getUid($openid)
    {
        $uidInfo = Db::name('app_user')->field('id')->where('openid',$openid)->find();
        return $uidInfo['id'];
    }

    public function format_date($time){
        $t=time()-$time;
        $f=array(
            '31536000'=>'年',
            '2592000'=>'个月',
            '604800'=>'星期',
            '86400'=>'天',
            '3600'=>'小时',
            '60'=>'分钟',
            '1'=>'秒'
        );
        foreach ($f as $k=>$v)    {
            if (0 !=$c=floor($t/(int)$k)) {
                return $c.$v.'前';
            }
        }
    }
}