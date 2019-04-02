<?php

namespace app\api\model;

use think\Model;

class SercertContent extends Model
{
	protected $table = 'xer_app_sercert';

	public function Content()
    {
        return $this->hasOne('SercertContentText','content_id')->setEagerlyType(0);
    }
}